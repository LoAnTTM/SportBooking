package handler

import (
	"spb/bsa/pkg/logger"
	"spb/bsa/pkg/utils"

	"github.com/gofiber/fiber/v3"
)

var ErrTokenParseFailed = fiber.NewError(fiber.StatusBadRequest, "verify token error")

// VerifyEmail godoc
// @summary verify email by token
func (h *Handler) VerifyEmail(ctx fiber.Ctx) error {
	fctx := utils.FiberCtx{Fctx: ctx}
	token := fctx.ParseQuery("token")

	err := h.service.VerifyEmail(token.(string))
	if err != nil {
		logger.Errorf("error verify email: %v", err)
		return fctx.ErrResponse(ErrTokenParseFailed)
	}
	return fctx.JsonResponse(fiber.StatusOK, "Email verification success")
}
