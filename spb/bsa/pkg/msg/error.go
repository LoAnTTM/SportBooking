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
)

var (
	SERVER_ERROR = fiber.NewError(fiber.StatusInternalServerError, CODE_SERVER_ERROR)
	FORBIDDEN    = fiber.NewError(fiber.StatusForbidden, CODE_FORBIDDEN)
	BAD_REQUEST  = fiber.NewError(fiber.StatusBadRequest, CODE_BAD_REQUEST)
	NOT_FOUND    = fiber.NewError(fiber.StatusNotFound, CODE_BAD_REQUEST)

	PARAM_INVALID            = fiber.NewError(fiber.StatusBadRequest, CODE_PARAM_INVALID)
	REQUEST_BODY_INVALID     = fiber.NewError(fiber.StatusBadRequest, CODE_REQUEST_BODY_INVALID)
	REFRESH_TOKEN_EXPIRED    = fiber.NewError(fiber.StatusBadRequest, CODE_REFRESH_TOKEN_EXPIRED)
	REGISTER_EMAIL_VERIFYING = fiber.NewError(fiber.StatusBadRequest, CODE_REGISTER_EMAIL_VERIFYING)
	VERIFY_TOKEN_EXPIRED     = fiber.NewError(fiber.StatusBadRequest, CODE_VERIFY_TOKEN_EXPIRED)
	EMAIL_DOES_NOT_EXIST     = fiber.NewError(fiber.StatusBadRequest, CODE_EMAIL_DOES_NOT_EXIST)
	UNAUTHORIZED             = fiber.NewError(fiber.StatusUnauthorized)
	NOT_ACCEPTABLE           = fiber.NewError(fiber.StatusNotAcceptable)
)
