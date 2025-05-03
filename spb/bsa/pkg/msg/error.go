package msg

import "github.com/gofiber/fiber/v3"

const (
	CODE_SERVER_ERROR = "ERS001"
	CODE_FORBIDDEN    = "ERS002"
	CODE_BAD_REQUEST  = "ERS003"
	CODE_NOT_FOUND    = "ERS004"

	CODE_REFRESH_TOKEN_EXPIRED    = "ERA001"
	CODE_VERIFY_TOKEN_EXPIRED     = "ERA002"
	CODE_EMAIL_DOES_NOT_EXIST     = "ERA003"
	CODE_REGISTER_EMAIL_VERIFYING = "ERA004"
	CODE_REQUEST_BODY_INVALID     = "ERA005"
	CODE_PARAM_INVALID            = "ERA006"
	CODE_EMAIL_ALREADY_EXIST      = "ERA007"
	CODE_INCORRECT_PASSWORD       = "ERA008"

	CODE_PAYMENT_AMOUNT_INVALID = "ERPA001"
	CODE_PAYMENT_FAILED         = "ERPA002"

	CODE_CLUB_NOT_FOUND           = "ECL001"
	CODE_CLUB_WRONG_OWNER         = "ECL002"
	CODE_CLUB_NAME_ALREADY_EXISTS = "ECL003"

	CODE_UNIT_NOT_FOUND           = "ERU001"
	CODE_UNIT_WRONG_OWNER         = "ERU002"
	CODE_UNIT_NAME_ALREADY_EXISTS = "ERU003"

	CODE_MEDIA_CREATE_FAILED = "ERM001"
)

var (
	SERVER_ERROR = fiber.NewError(fiber.StatusInternalServerError, CODE_SERVER_ERROR)
	FORBIDDEN    = fiber.NewError(fiber.StatusForbidden, CODE_FORBIDDEN)
	BAD_REQUEST  = fiber.NewError(fiber.StatusBadRequest, CODE_BAD_REQUEST)
	NOT_FOUND    = fiber.NewError(fiber.StatusNotFound, CODE_BAD_REQUEST)
	UNAUTHORIZED = fiber.NewError(fiber.StatusUnauthorized)

	PARAM_INVALID            = fiber.NewError(fiber.StatusBadRequest, CODE_PARAM_INVALID)
	REQUEST_BODY_INVALID     = fiber.NewError(fiber.StatusBadRequest, CODE_REQUEST_BODY_INVALID)
	REFRESH_TOKEN_EXPIRED    = fiber.NewError(fiber.StatusBadRequest, CODE_REFRESH_TOKEN_EXPIRED)
	REGISTER_EMAIL_VERIFYING = fiber.NewError(fiber.StatusBadRequest, CODE_REGISTER_EMAIL_VERIFYING)
	VERIFY_TOKEN_EXPIRED     = fiber.NewError(fiber.StatusBadRequest, CODE_VERIFY_TOKEN_EXPIRED)
	EMAIL_DOES_NOT_EXIST     = fiber.NewError(fiber.StatusNotFound, CODE_EMAIL_DOES_NOT_EXIST)
	EMAIL_ALREADY_EXIST      = fiber.NewError(fiber.StatusBadRequest, CODE_EMAIL_ALREADY_EXIST)
	INCORRECT_PASSWORD       = fiber.NewError(fiber.StatusBadRequest, CODE_INCORRECT_PASSWORD)

	// payment
	PAYMENT_AMOUNT_INVALID = fiber.NewError(fiber.StatusBadRequest, CODE_PAYMENT_AMOUNT_INVALID)
	PAYMENT_FAILED         = fiber.NewError(fiber.StatusBadRequest, CODE_PAYMENT_FAILED)

	// club
	CLUB_NOT_FOUND           = fiber.NewError(fiber.StatusNotFound, CODE_CLUB_NOT_FOUND)
	CLUB_WRONG_OWNER         = fiber.NewError(fiber.StatusBadRequest, CODE_CLUB_WRONG_OWNER)
	CLUB_NAME_ALREADY_EXISTS = fiber.NewError(fiber.StatusBadRequest, CODE_CLUB_NAME_ALREADY_EXISTS)

	// unit
	UNIT_NOT_FOUND           = fiber.NewError(fiber.StatusNotFound, CODE_UNIT_NOT_FOUND)
	UNIT_WRONG_OWNER         = fiber.NewError(fiber.StatusBadRequest, CODE_UNIT_WRONG_OWNER)
	UNIT_NAME_ALREADY_EXISTS = fiber.NewError(fiber.StatusBadRequest, CODE_UNIT_NAME_ALREADY_EXISTS)

	// media
	MEDIA_CREATE_FAILED = fiber.NewError(fiber.StatusBadRequest, CODE_MEDIA_CREATE_FAILED)
)
