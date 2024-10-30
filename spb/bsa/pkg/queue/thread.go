package queue

import "sync"

type routineGroup struct {
	sync.WaitGroup
}

func NewRoutineGroup() *routineGroup {
	return new(routineGroup)
}

func (r *routineGroup) Go(f func()) {
	r.Add(1)
	go func() {
		defer r.Done()
		f()
	}()
}
