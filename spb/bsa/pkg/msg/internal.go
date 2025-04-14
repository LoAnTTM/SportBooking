package msg

import (
	"errors"
	"fmt"
)

var (
	// request
	ErrPermission        = NewError("permission denied")
	ErrUnauthorized      = NewError("unauthorized")
	ErrNotFound          = NewErrorArgs("[%s] not found")
	ErrUpdateFailed      = NewErrorArgs("update [%s] failed: %+v")
	ErrDeleteFailed      = NewErrorArgs("delete [%s] failed: %+v")
	ErrCreateFailed      = NewErrorArgs("create [%s] failed: %+v")
	ErrGetFailed         = NewErrorArgs("get [%s] failed: %+v")
	ErrUniqueExists      = NewErrorArgs("unique field [%s] already exists")
	ErrVerifyFailed      = NewErrorArgs("verify [%s] failed: %+v")
	ErrInvalid           = NewErrorArgs("[%s] invalid: %+v")
	ErrAddPropertyFailed = NewErrorArgs("add property [%s] to [%s] failed: %+v")
	ErrCommitFailed      = NewErrorArgs("commit transaction failed: %+v")

	// auth
	ErrIncorrectPassword       = NewError("incorrect password")
	ErrEmailExists             = NewError("email already exists")
	ErrEmailVerifying          = NewError("email already verifying")
	ErrEmailAlreadyVerified    = NewError("email already verified")
	ErrVerifyEmailNotification = NewError("verify email notification failed")
	ErrAccessKeyNotFound       = NewError("['accessToken'] isn't present")
	ErrForgotPasswordFailed    = NewErrorArgs("forgot password failed: %+v")
	ErrGoogleLoginFailed       = NewErrorArgs("google login failed: %+v")
	ErrLoginFailed             = NewErrorArgs("login failed: %+v")
	ErrRegisterFailed          = NewErrorArgs("register failed: %+v")
	ErrSendOTPFailed           = NewErrorArgs("Send OTP failed: %+v")
	ErrResendOTPFailed         = NewErrorArgs("resend OTP failed: %+v")
	ErrResetPasswordFailed     = NewErrorArgs("reset password failed: %+v")

	// payment
	ErrPaymentFailed             = NewErrorArgs("payment failed: %+v")
	ErrMoMoCallbackFailed        = NewErrorArgs("momo callback failed: %+v")
	ErrZaloPayCallbackInvalidMac = NewErrorArgs("invalid MAC: expected %s, got %s")

	// cache
	ErrCacheSetFailed     = NewErrorArgs("failed to set [%s] cache: %+v")
	ErrCacheGetFailed     = NewErrorArgs("failed to get [%s] cache: %+v")
	ErrInBlackList        = NewErrorArgs("[%s] is blacklisted")
	ErrSetBlacklistFailed = NewErrorArgs("failed to set [%s] to blacklist: %+v")

	// notification
	ErrSendNotificationFailed = NewErrorArgs("failed to send notification: %+v")

	// queue
	ErrMissingWorker       = NewError("missing worker module")
	ErrQueueShutdownFailed = NewErrorArgs("queue shutdown failed: %+v")
	ErrQueueShutdown       = NewError("queue is shutdown")
	ErrNoTaskInQueue       = NewError("no task in queue")
	ErrQueueHasBeenClosed  = NewError("queue has been closed")
	ErrRunTaskFailed       = NewErrorArgs("run task failed: %+v")

	// redis
	ErrRedisPingFailed      = NewErrorArgs("failed to ping redis: %+v")
	ErrUnexpectedSignMethod = NewErrorArgs("unexpected signing method: %+v")

	// jwt
	ErrParseTokenFromCookie = NewErrorArgs("failed to parse token from cookie: %+v")
	ErrParseTokenFromHeader = NewErrorArgs("failed to parse token from header: %+v")
	ErrSetTokenToCookie     = NewErrorArgs("failed to set token to cookie: %+v")
	ErrSetTokenToHeader     = NewErrorArgs("failed to set token to header: %+v")
	ErrEmailSendFailed      = NewErrorArgs("email send failed: %v")
	ErrJwtMiddlewareFailed  = NewErrorArgs("jwt middleware failed: %v")
	ErrGenerateTokenFailed  = NewErrorArgs("generate token failed: %+v")
	ErrTokenExpired         = NewError("token expired")

	// parser
	ErrMarshalFailed       = NewErrorArgs("failed to marshal json: %+v")
	ErrUnmarshalFailed     = NewErrorArgs("failed to unmarshal json: %+v")
	ErrRequestJsonNotValid = NewError("request json is not valid")
	ErrParseUUIDFailed     = NewErrorArgs("failed to parse [%s] uuid: %+v")
	ErrParseStructFailed   = NewErrorArgs("failed to parse [%s] struct: %+v")

	// server
	ErrLoadEnvFailed       = NewErrorArgs("failed to load env: %+v")
	ErrConnectionFailed    = NewErrorArgs("failed to connect database: %+v")
	ErrRedisConnectFailed  = NewErrorArgs("failed to connect redis: %+v")
	ErrLoadValidatorFailed = NewErrorArgs("failed to load validator: %+v")
	ErrAWSConnectFailed    = NewErrorArgs("failed to connect AWS: %+v")
	ErrMigrationFailed     = NewErrorArgs("failed to migrate database: %+v")
	ErrJoinTableFailed     = NewErrorArgs("failed to join table: %+v")
	ErrMissingToken        = NewError("missing access token or refresh token")
	ErrServerStartFailed   = NewErrorArgs("failed to start server: %+v")
)

const AWSInternalServerError = "InternalServerError"

var (
	// queue
	InfoAllTaskShutdown = NewMessageArgs("shutdown all tasks: %d workers")
	InfoRemainingRetry  = NewMessageArgs("retry remaining times: %d, delay time: %s")

	// payment
	InfoCreatePayment = NewMessageArgs("creating payment with MoMo: %+v")
	InfoMoMoCallback  = NewMessageArgs("momo callback: %+v")
	InfoPaySuccess    = NewMessageArgs("payment success: %+v")
	InfoPayFailed     = NewMessageArgs("payment failed: %+v")

	// notification
	InfoSendNotification = NewMessageArgs("Send notification [%s] to: %+v")
)

const (
	InfoShutdownNotification = "shutdown notification service"
)

func NewError(msg string) error {
	return errors.New(msg)
}

func NewErrorArgs(msg string) func(...any) error {
	return func(args ...any) error {
		return fmt.Errorf(msg, args...)
	}
}

func NewMessageArgs(msg string) func(...any) string {
	return func(args ...any) string {
		return fmt.Sprintf(msg, args...)
	}
}

func AWSError(errType string, err error) error {
	return fmt.Errorf("%s: %s", errType, err.Error())
}
