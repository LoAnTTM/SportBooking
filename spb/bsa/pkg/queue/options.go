package queue

import (
	"context"
	"runtime"
)

var (
	defaultCapacity    = 0
	defaultWorkerCount = runtime.NumCPU()
	defaultFn          = func(context.Context, QueuedMessage) error { return nil }
	defaultMetric      = NewMetric()
)

type Options struct {
	workerCount int
	queueSize   int
	worker      Worker
	fn          func(context.Context, QueuedMessage) error
	afterFn     func()
	metric      Metric
}

func NewOptions(opts ...Option) *Options {
	options := &Options{
		workerCount: defaultWorkerCount,
		queueSize:   defaultCapacity,
		worker:      nil,
		fn:          defaultFn,
		metric:      defaultMetric,
	}
	for _, o := range opts {
		o.apply(options)
	}
	return options
}

type Option interface {
	apply(*Options)
}

type OptionFunc func(*Options)

func (f OptionFunc) apply(o *Options) {
	f(o)
}

func WithWorkerCount(workerCount int) Option {
	return OptionFunc(func(o *Options) {
		o.workerCount = workerCount
	})
}

func WithQueueSize(queueSize int) Option {
	return OptionFunc(func(o *Options) {
		o.queueSize = queueSize
	})
}

func WithWorker(worker Worker) Option {
	return OptionFunc(func(o *Options) {
		o.worker = worker
	})
}

func WithFn(fn func(context.Context, QueuedMessage) error) Option {
	return OptionFunc(func(o *Options) {
		o.fn = fn
	})
}

func WithAfterFn(afterFn func()) Option {
	return OptionFunc(func(o *Options) {
		o.afterFn = afterFn
	})
}

func WithMetric(metric Metric) Option {
	return OptionFunc(func(o *Options) {
		o.metric = metric
	})
}
