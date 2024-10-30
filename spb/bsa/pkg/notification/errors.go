package notification

import (
	"errors"
	"fmt"
)

var (
	ErrEmailSendFailed = NewErrorArgs("email send failed: %v")
	ErrInvalidRequest  = NewError("invalid request")
)

func NewError(msg string) error {
	return errors.New(msg)
}

func NewErrorArgs(msg string) func(...interface{}) error {
	return func(args ...interface{}) error {
		return fmt.Errorf(msg, args)
	}
}
