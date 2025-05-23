package queue

func NewPool(size int, opts ...Option) *Queue {
	o := []Option{
		WithWorkerCount(size),
	}
	o = append(o, opts...)

	q, err := NewQueue(o...)
	if err != nil {
		panic(err)
	}
	q.Start()
	return q
}
