package handler

import (
	"spb/bsa/api/auth/model"
	"spb/bsa/pkg/global"
	"spb/bsa/pkg/logger"
	"spb/bsa/pkg/msg"
	"spb/bsa/pkg/utils"

	"github.com/gofiber/fiber/v3"
)

// VerifyRegisterToken godoc
//
// @summary		Verify email api
// @description	Verify email api
// @tags		auth
// @accept		json
// @produce		json
// @param	  	group body model.VerifyRegisterTokenRequest true "Verify email"
// @success		200 {object} utils.JSONResult{}			 "Email verification success"
// @failure		400 {object} utils.JSONResult{}			 "Verify token error"
// @router		/api/v1/auth/verify-register-token [post]
func (h *Handler) VerifyRegisterToken(ctx fiber.Ctx) error {
	reqBody := new(model.VerifyRegisterTokenRequest)
	fctx := utils.FiberCtx{Fctx: ctx}

	if err := fctx.ParseJsonToStruct(reqBody, global.SPB_VALIDATOR); err != nil {
		logger.Errorf(msg.ErrParseStructFailed("VerifyRegisterTokenRequest", err))
		return fctx.ErrResponse(msg.REQUEST_BODY_INVALID)
	}

	if err := h.service.VerifyRegisterToken(reqBody); err != nil {
		logger.Errorf(msg.ErrInvalid("OTP", err))
		return fctx.ErrResponse(msg.BAD_REQUEST)
	}
	return fctx.JsonResponse(fiber.StatusOK, msg.CODE_SUCCESS)
}
