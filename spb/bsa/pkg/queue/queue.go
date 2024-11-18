package queue

import (
	"context"
	"errors"
	"sync"
	"sync/atomic"
	"time"

	"spb/bsa/pkg/logger"
	"spb/bsa/pkg/msg"
	"spb/bsa/pkg/utils"

	"github.com/jpillora/backoff"
)

type Queue struct {
	mu          sync.Mutex
	metric      *metric
	workerCount int
	workerGroup *routineGroup
	quit        chan struct{}
	ready       chan struct{}
	worker      Worker
	stopOnce    sync.Once
	stopFlag    int32
	afterFn     func()
}

func NewQueue(opts ...Option) (*Queue, error) {
	o := NewOptions(opts...)
	q := &Queue{
		workerGroup: NewRoutineGroup(),
		quit:        make(chan struct{}),
		ready:       make(chan struct{}, 1),
		workerCount: o.workerCount,
		worker:      o.worker,
		stopOnce:    sync.Once{},
		stopFlag:    0,
		metric:      &metric{},
		afterFn:     o.afterFn,
	}

	if q.worker == nil {
		return nil, msg.ErrMissingWorker
	}
	return q, nil
}

func (q *Queue) Start() {
	q.mu.Lock()
	count := q.workerCount
	q.mu.Unlock()

	if count == 0 {
		return
	}

	q.workerGroup.Go(func() {
		q.start()
	})
}

func (q *Queue) Shutdown() {
	if !atomic.CompareAndSwapInt32(&q.stopFlag, 0, 1) {
		return
	}

	q.stopOnce.Do(func() {
		if q.metric.BusyWorkers() > 0 {
			logger.Infof("shutdown all tasks: %d workers", q.metric.BusyWorkers())
		}
		if err := q.worker.Shutdown(); err != nil {
			logger.Errorf("failed to shutdown worker: %v", err)
		}
		close(q.quit)
	})
}

func (q *Queue) Release() {
	q.Shutdown()
	q.Wait()
}

func (q *Queue) BusyWorkers() int {
	return utils.SafeUint64ToInt(q.metric.BusyWorkers())
}

func (q *Queue) SuccessTasks() int {
	return utils.SafeUint64ToInt(q.metric.SuccessTasks())
}

func (q *Queue) FailureTasks() int {
	return utils.SafeUint64ToInt(q.metric.FailureTasks())
}

func (q *Queue) SubmittedTasks() int {
	return utils.SafeUint64ToInt(q.metric.SubmittedTasks())
}

func (q *Queue) Wait() {
	q.workerGroup.Wait()
}

func (q *Queue) Queue(m QueuedMessage, opts ...AllowOption) error {
	data := NewMessage(m, opts...)
	data.Encode()

	return q.queue(&data)
}

func (q *Queue) QueueTask(task TaskFunc, opts ...AllowOption) error {
	data := NewTask(task, opts...)
	return q.queue(&data)
}

func (q *Queue) queue(m *Message) error {
	if atomic.LoadInt32(&q.stopFlag) == 1 {
		return msg.ErrQueueShutdown
	}
	if err := q.worker.Queue(m); err != nil {
		return err
	}
	q.metric.IncSubmittedTask()
	return nil
}

func (q *Queue) work(task QueuedMessage) {
	var err error
	defer func() {
		q.metric.DecBusyWorker()
		e := recover()
		if e != nil {
			logger.Errorf("panic error: %v", e)
		}
		q.schedule()

		if err == nil && e == nil {
			q.metric.IncSuccessTask()
		} else {
			q.metric.IncFailureTask()
		}
		if q.afterFn != nil {
			q.afterFn()
		}
	}()

	if err = q.run(task); err != nil {
		logger.Errorf("failed to run task: %v", err)
	}
}

func (q *Queue) run(task QueuedMessage) error {
	data := task.(*Message)
	if data.Task == nil {
		data.Data = data.Payload
	}
	return q.handle(data)
}

func (q *Queue) handle(m *Message) error {
	done := make(chan error, 1)
	panicChan := make(chan interface{}, 1)
	startTime := time.Now()
	ctx, cancel := context.WithTimeout(context.Background(), m.Timeout)
	defer cancel()

	go func() {
		defer func() {
			if p := recover(); p != nil {
				panicChan <- p
			}
		}()

		var err error
		b := &backoff.Backoff{
			Min:    m.RetryMin,
			Max:    m.RetryMax,
			Factor: m.RetryFactor,
			Jitter: m.Jitter,
		}
		delay := m.RetryDelay

	loop:
		for {
			if m.Task != nil {
				err = m.Task(ctx)
			} else {
				err = q.worker.Run(ctx, m)
			}

			if err == nil || m.RetryCount == 0 {
				break
			}
			m.RetryCount--

			if m.RetryDelay == 0 {
				delay = b.Duration()
			}

			select {
			case <-time.After(delay):
				logger.Infof("retry remaining times: %d, delay time: %s", m.RetryCount, delay)
			case <-ctx.Done():
				err = ctx.Err()
				break loop
			}
		}

		done <- err
	}()

	select {
	case p := <-panicChan:
		panic(p)
	case <-ctx.Done(): // timeout reached
		return ctx.Err()
	case <-q.quit: // shutdown service
		cancel()
		leftTime := m.Timeout - time.Since(startTime)
		select {
		case <-time.After(leftTime):
			return context.DeadlineExceeded
		case err := <-done:
			return err
		case p := <-panicChan:
			panic(p)
		}
	case err := <-done: // job finish
		return err
	}
}

func (q *Queue) UpdateWorkerCount(count int) {
	q.mu.Lock()
	q.workerCount = count
	q.mu.Unlock()
	q.schedule()
}

// schedule to check worker number
func (q *Queue) schedule() {
	q.mu.Lock()
	defer q.mu.Unlock()

	if q.BusyWorkers() >= q.workerCount {
		return
	}

	select {
	case q.ready <- struct{}{}:
	default:
	}
}

func (q *Queue) start() {
	tasks := make(chan QueuedMessage, 1)
	for {
		q.schedule()

		select {
		case <-q.ready:
		case <-q.quit:
			return
		}

		// fetch task
		q.workerGroup.Go(func() {
			for {
				t, err := q.worker.Request()
				if t == nil || err != nil {
					if err != nil {
						select {
						case <-q.quit:
							if !errors.Is(err, msg.ErrNoTaskInQueue) {
								close(tasks)
								return
							}
						case <-time.After(time.Second):
							// sleep 1 second to fetch new  task
						}
					}
				}

				if t != nil {
					tasks <- t
					return
				}

				select {
				case <-q.quit:
					if !errors.Is(err, msg.ErrNoTaskInQueue) {
						close(tasks)
						return
					}
				default:
				}
			}
		})

		task, ok := <-tasks
		if !ok {
			return
		}

		q.metric.IncBusyWorker()
		q.workerGroup.Go(func() {
			q.work(task)
		})
	}
}
