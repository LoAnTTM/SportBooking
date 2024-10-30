package utils

import "errors"

var ErrRequestJsonNotValid = NewError("request json is not valid")

func NewError(msg string) error {
	return errors.New(msg)
}
