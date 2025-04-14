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
// @Summary Resend verify register token
// @Description Resend verify register token
// @Tags 	auth
// @Accept 	json
// @Produce json
// @Param body body model.ResendVerifyRegisterTokenRequest true "body"
// @Success 200 {string} string "Resend verify email OTP success"
// @Failure 400 {string} string "Resend verify email OTP failed"
// @Router /api/v1/auth/verify-register-token/resend [post]
func (h *Handler) ResendVerifyRegisterToken(ctx fiber.Ctx) error {
	reqBody := new(model.ResendVerifyRegisterTokenRequest)
	fctx := utils.FiberCtx{Fctx: ctx}

	if err := fctx.ParseJsonToStruct(reqBody, global.SPB_VALIDATOR); err != nil {
		logger.Errorf(msg.ErrParseStructFailed("ResendVerifyRegisterTokenRequest", err))
		return fctx.ErrResponse(msg.REQUEST_BODY_INVALID)
	}

	if err := h.service.ResendVerifyRegisterToken(reqBody); err != nil {
		logger.Errorf(msg.ErrResendOTPFailed(err))
		return fctx.ErrResponse(msg.VERIFY_TOKEN_EXPIRED)
	}

	return fctx.JsonResponse(fiber.StatusOK, msg.CODE_SUCCESS)
}
