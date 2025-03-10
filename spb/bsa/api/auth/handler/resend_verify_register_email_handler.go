package handler

import (
	"spb/bsa/api/auth/model"
	"spb/bsa/pkg/global"
	"spb/bsa/pkg/logger"
	"spb/bsa/pkg/msg"
	"spb/bsa/pkg/utils"

	"github.com/gofiber/fiber/v3"
)

// ResendVerifyRegisterToken godoc
//
// @Summary Resend verify email OTP
// @Description Resend verify email OTP
// @Tags Auth
// @Accept json
// @Produce json
// @Param body body model.ResendVerifyRegisterTokenRequest true "body"
// @Success 200 {string} string "Resend verify email OTP success"
// @Failure 400 {string} string "Resend verify email OTP failed"
// @Router /auth/resend-verify-email-otp [post]
func (h *Handler) ResendVerifyRegisterToken(ctx fiber.Ctx) error {
	reqBody := new(model.ResendVerifyRegisterTokenRequest)
	fctx := utils.FiberCtx{Fctx: ctx}

	if err := fctx.ParseJsonToStruct(reqBody, global.SPB_VALIDATOR); err != nil {
		logger.Errorf("error parse json to struct: %v", err)
		return fctx.ErrResponse(msg.VERIFY_TOKEN_FAILED)
	}

	if err := h.service.ResendVerifyRegisterToken(reqBody); err != nil {
		logger.Errorf("error resend verify email otp: %v", err)
		return fctx.ErrResponse(msg.VERIFY_TOKEN_FAILED)
	}

	return fctx.JsonResponse(fiber.StatusOK, msg.CODE_VERIFY_TOKEN_SUCCESS)
}
