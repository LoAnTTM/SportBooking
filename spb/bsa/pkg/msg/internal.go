package msg

import (
	"errors"
	"fmt"
)

var (
	ErrIncorrectPassword       = NewError("incorrect password")
	ErrLocationNotFound        = NewError("location not found")
	ErrEmailExists             = NewError("email already exists")
	ErrEmailVerifying          = NewError("email already verifying")
	ErrSportTypeExists         = NewError("sport type already exists")
	ErrSportTypeNotFound       = NewError("sport type not found")
	ErrPermission              = NewError("unit price does not have permission")
	ErrUnitPriceNotFound       = NewError("unit price not found")
	ErrUnitServiceNotFound     = NewError("unit service not found")
	ErrInvalidToken            = NewError("malformed token")
	ErrTokenExpired            = NewError("token expired")
	ErrVerifyEmailNotification = NewError("verify email notification failed")
	ErrUnauthorized            = NewError("unauthorized")
	ErrAccessKeyNotFound       = NewError("['accessToken'] isn't present")
	ErrInvalidRequest          = NewError("invalid request")
	ErrMissingWorker           = NewError("missing worker module")
	ErrQueueShutdown           = NewError("queue is shutdown")
	ErrNoTaskInQueue           = NewError("no task in queue")
	ErrQueueHasBeenClosed      = NewError("queue has been closed")
	ErrRequestJsonNotValid     = NewError("request json is not valid")
	ErrUserNotFound            = NewError("user not found")
	ErrUnitNotFound            = NewError("unit not found")
	ErrUpdateUnitFailed        = NewError("update unit failed")
	ErrUnitNameExists          = NewError("unit name already exists")
	ErrMetadataNotFound        = NewError("metadata not found")
	ErrUpdateMetadataFailed    = NewError("update metadata failed")
)

var (
	ErrUnexpectedSignMethod = NewErrorArgs("unexpected signing method: %+v")
	ErrParseTokenFromCookie = NewErrorArgs("failed to parse token from cookie: %+v")
	ErrParseTokenFromHeader = NewErrorArgs("failed to parse token from header: %+v")
	ErrEmailSendFailed      = NewErrorArgs("email send failed: %v")
	ErrConnectionFailed     = NewErrorArgs("failed to connect database: %+v")
	ErrMigrationFailed      = NewErrorArgs("failed to migrate database: %+v")
	ErrJoinTableFailed      = NewErrorArgs("failed to join table: %+v")
	ErrMissingToken         = NewError("missing access token or refresh token")
	ErrGenerateToken        = NewErrorArgs("failed to make jwt: %+v")
)

const (
	AWSInternalServerError = "InternalServerError"
)

func NewError(msg string) error {
	return errors.New(msg)
}

func NewErrorArgs(msg string) func(...any) error {
	return func(args ...any) error {
		return fmt.Errorf(msg, args)
	}
}

func AWSError(errType string, err error) error {
	return fmt.Errorf("%s: %s", errType, err.Error())
}
