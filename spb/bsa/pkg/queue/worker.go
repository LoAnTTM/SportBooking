package queue

import "context"

type QueuedMessage interface {
	Bytes() []byte
}

type Worker interface {
	Run(ctx context.Context, task QueuedMessage) error
	Shutdown() error
	Queue(task QueuedMessage) error
	Request() (QueuedMessage, error)
}
