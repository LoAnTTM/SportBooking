package worker

import (
	"context"
	"encoding/json"
	"sync"
	"sync/atomic"
	"time"

	"spb/bsa/pkg/logger"
	"spb/bsa/pkg/msg"
	"spb/bsa/pkg/queue"

	"github.com/redis/go-redis/v9"
)

var _ queue.Worker = (*Worker)(nil)

type Worker struct {
	rdb      redis.Cmdable
	pubsub   *redis.PubSub
	channel  <-chan *redis.Message
	stopFlag int32
	stopOnce sync.Once
	stop     chan struct{}
	opts     options
}

func NewWorker(opts ...Option) *Worker {
	var err error
	w := &Worker{
		opts: newOptions(opts...),
		stop: make(chan struct{}),
	}

	w.rdb = w.opts.redisClient.Conn()

	_, err = w.rdb.Ping(context.Background()).Result()
	if err != nil {
		logger.Fatalf("%v", err)
	}
	ctx := context.Background()
	switch v := w.rdb.(type) {
	case *redis.Client:
		w.pubsub = v.Subscribe(ctx, w.opts.channelName)
	case *redis.ClusterClient:
		w.pubsub = v.Subscribe(ctx, w.opts.channelName)
	}

	var ropts []redis.ChannelOption
	if w.opts.channelSize > 1 {
		ropts = append(ropts, redis.WithChannelSize(w.opts.channelSize))
	}

	w.channel = w.pubsub.Channel(ropts...)
	if err := w.pubsub.Ping(ctx); err != nil {
		logger.Fatalf("%v", err)
	}

	return w
}

func (w *Worker) Run(ctx context.Context, task queue.QueuedMessage) error {
	return w.opts.runFunc(ctx, task)
}

func (w *Worker) Shutdown() error {
	if !atomic.CompareAndSwapInt32(&w.stopFlag, 0, 1) {
		return msg.ErrQueueShutdown
	}
	w.stopOnce.Do(func() {
		_ = w.pubsub.Close()
		switch v := w.rdb.(type) {
		case *redis.Client:
			_ = v.Close()
		case *redis.ClusterClient:
			_ = v.Close()
		}
		close(w.stop)
	})
	return nil
}

func (w *Worker) Queue(job queue.QueuedMessage) error {
	if atomic.LoadInt32(&w.stopFlag) == 1 {
		return msg.ErrQueueShutdown
	}

	ctx := context.Background()
	err := w.rdb.Publish(ctx, w.opts.channelName, job.Bytes()).Err()
	if err != nil {
		return err
	}
	return nil
}

// Request task from redis pubsub queue every 5 second
func (w *Worker) Request() (queue.QueuedMessage, error) {
	clock := 0
loop:
	for {
		select {
		case task, ok := <-w.channel:
			if !ok {
				return nil, msg.ErrQueueHasBeenClosed
			}
			var data queue.Message
			_ = json.Unmarshal([]byte(task.Payload), &data)
			return &data, nil
		case <-time.After(1 * time.Second):
			if clock == 5 {
				break loop
			}
			clock += 1
		}
	}
	return nil, msg.ErrNoTaskInQueue
}
