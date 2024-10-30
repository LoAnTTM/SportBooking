package queue

import (
	"bytes"
	"context"
	"encoding/json"
	"strings"
	"time"
)

type TaskFunc func(context.Context) error

type Message struct {
	Task        TaskFunc      `json:"-"`
	Timeout     time.Duration `json:"timeout"`
	Payload     []byte        `json:"body"`
	RetryCount  int64         `json:"retry_count"`
	RetryDelay  time.Duration `json:"retry_delay"`
	RetryFactor float64       `json:"retry_factor"`
	RetryMin    time.Duration `json:"retry_min"`
	RetryMax    time.Duration `json:"retry_max"`
	Jitter      bool          `json:"jitter"`
	Data        []byte        `json:"-"`
}

// Bytes get
func (m *Message) Bytes() []byte {
	return m.Data
}

func (m *Message) Encode() {
	m.Data = Encode(m)
}

func NewMessage(m QueuedMessage, opts ...AllowOption) Message {
	o := NewJobOptions(opts...)

	return Message{
		Timeout:     o.timeout,
		RetryCount:  o.retryCount,
		RetryDelay:  o.retryDelay,
		RetryFactor: o.retryFactor,
		RetryMin:    o.retryMin,
		RetryMax:    o.retryMax,
		Jitter:      o.jitter,
		Payload:     m.Bytes(),
	}
}

func NewTask(task TaskFunc, opts ...AllowOption) Message {
	o := NewJobOptions(opts...)

	return Message{
		Task:        task,
		Timeout:     o.timeout,
		RetryCount:  o.retryCount,
		RetryDelay:  o.retryDelay,
		RetryFactor: o.retryFactor,
		RetryMin:    o.retryMin,
		RetryMax:    o.retryMax,
		Jitter:      o.jitter,
	}
}

// Encode for encoding the structure
func Encode(m *Message) []byte {
	buf := new(bytes.Buffer)
	err := json.NewEncoder(buf).Encode(*m)
	if err != nil {
		panic(err)
	}
	return buf.Bytes()
}

// Decode for decoding the structure
func Decode(m []byte) *Message {
	if len(m) == 0 {
		return nil
	}

	msg := new(Message)
	err := json.NewDecoder(strings.NewReader(string(m))).Decode(msg)
	if err != nil {
		panic(err)
	}
	return msg
}
