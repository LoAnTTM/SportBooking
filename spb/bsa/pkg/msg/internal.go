package msg

import (
	"errors"
	"fmt"
)

var (
	ErrIncorrectPassword    = NewError("incorrect password")
	ErrLocationNotFound     = NewError("location not found")
	ErrEmailExists          = NewError("email already exists")
	ErrSportTypeExists      = NewError("sport type already exists")
	ErrSportTypeNotFound    = NewError("sport type not found")
	ErrPermission           = NewError("unit price does not have permission")
	ErrUnitPriceNotFound    = NewError("unit price not found")
	ErrUnitServiceNotFound  = NewError("unit service not found")
	ErrInvalidToken         = NewError("malformed token")
	ErrUnexpectedSignMethod = NewErrorArgs("unexpected signing method: %+v")
	ErrTokenExpired         = NewError("token expired")
	ErrUnauthorized         = NewError("unauthorized")
	ErrAccessKeyNotFound    = NewError("['accessToken'] isn't present")
	ErrParseTokenFromCookie = NewErrorArgs("failed to parse token from cookie: %+v")
	ErrParseTokenFromHeader = NewErrorArgs("failed to parse token from header: %+v")
	ErrEmailSendFailed      = NewErrorArgs("email send failed: %v")
	ErrInvalidRequest       = NewError("invalid request")
	ErrConnectionFailed     = NewErrorArgs("failed to connect database: %+v")
	ErrMigrationFailed      = NewErrorArgs("failed to migrate database: %+v")
	ErrJoinTableFailed      = NewErrorArgs("failed to join table: %+v")
	ErrMissingWorker        = NewError("missing worker module")
	ErrQueueShutdown        = NewError("queue is shutdown")
	ErrNoTaskInQueue        = NewError("no task in queue")
	ErrQueueHasBeenClosed   = NewError("queue has been closed")
	ErrRequestJsonNotValid  = NewError("request json is not valid")
)

const (
	AWSInternalServerError = "InternalServerError"
)

func NewError(msg string) error {
	return errors.New(msg)
}

func NewErrorArgs(msg string) func(...interface{}) error {
	return func(args ...interface{}) error {
		return fmt.Errorf(msg, args)
	}
}

func AWSError(errType string, err error) error {
	return fmt.Errorf("%s: %s", errType, err.Error())
}
