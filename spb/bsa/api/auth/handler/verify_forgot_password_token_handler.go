package handler

import (
	"spb/bsa/api/auth/model"
	"spb/bsa/pkg/global"
	"spb/bsa/pkg/logger"
	"spb/bsa/pkg/msg"
	"spb/bsa/pkg/utils"

	"github.com/gofiber/fiber/v3"
)

// VerifyForgotPasswordToken godoc
//
// @summary		Verify reset token api
// @description	Verify reset token api
// @tags	 	auth
// @accept		json
// @produce		json
// @param		group body model.VerifyForgotPasswordTokenRequest true "Verify reset token"
// @success		200 {object} utils.JSONResult{}			 "Verify reset token success"
// @failure		400 {object} utils.JSONResult{}			 "Verify reset token failed"
// @router		/api/v1/auth/verify-forgot-password-token [post]
func (h *Handler) VerifyForgotPasswordToken(ctx fiber.Ctx) error {
	reqBody := new(model.VerifyForgotPasswordTokenRequest)
	fctx := utils.FiberCtx{Fctx: ctx}

	if err := fctx.ParseJsonToStruct(reqBody, global.SPB_VALIDATOR); err != nil {
		logger.Errorf(msg.ErrParseStructFailed("VerifyForgotPasswordTokenRequest", err))
		return fctx.ErrResponse(msg.REQUEST_BODY_INVALID)
	}

	if err := h.service.VerifyForgotPasswordToken(reqBody); err != nil {
		logger.Errorf(msg.ErrInvalid("OTP", err))
		return fctx.ErrResponse(msg.BAD_REQUEST)
	}

	return fctx.JsonResponse(fiber.StatusOK, msg.CODE_SUCCESS)
}
