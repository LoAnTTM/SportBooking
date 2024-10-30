package auth

import (
	"errors"
	"fmt"
)

var (
	ErrInvalidToken         = NewError("malformed token")
	ErrUnexpectedSignMethod = NewErrorArgs("unexpected signing method: %+v")
	ErrTokenExpired         = NewError("token expired")
	ErrUnauthorized         = NewError("unauthorized")
	ErrAccessKeyNotFound    = NewError("['accessToken'] isn't present")
	ErrParseTokenFromCookie = NewErrorArgs("failed to parse token from cookie: %+v")
	ErrParseTokenFromHeader = NewErrorArgs("failed to parse token from header: %+v")
)

func NewError(msg string) error {
	return errors.New(msg)
}

func NewErrorArgs(msg string) func(...interface{}) error {
	return func(args ...interface{}) error {
		return fmt.Errorf(msg, args)
	}
}
