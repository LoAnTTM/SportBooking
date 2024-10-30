package queue

import "errors"

var (
	ErrMissingWorker      = errors.New("missing worker module")
	ErrQueueShutdown      = errors.New("queue is shutdown")
	ErrNoTaskInQueue      = errors.New("no task in queue")
	ErrQueueHasBeenClosed = errors.New("queue has been closed")
)
