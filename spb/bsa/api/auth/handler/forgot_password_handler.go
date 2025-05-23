package handler

import (
	"spb/bsa/api/auth/model"
	"spb/bsa/pkg/global"
	"spb/bsa/pkg/logger"
	"spb/bsa/pkg/msg"
	"spb/bsa/pkg/utils"

	"github.com/gofiber/fiber/v3"
)

// ForgotPasswordHandler godoc
//
// @summary		Forgot password api
// @description	Forgot password api
// @tags	 	auth
// @accept		json
// @produce		json
// @param		group body model.ForgotPasswordRequest true "Forgot password"
// @success		200 {object} utils.JSONResult{} 			"Forgot password success"
// @failure		400 {object} utils.JSONResult{}				"Forgot password failed"
// @router		/api/v1/auth/forgot-password [post]
func (h *Handler) ForgotPasswordHandler(ctx fiber.Ctx) error {
	// parse request
	reqBody := new(model.ForgotPasswordRequest)
	fctx := utils.FiberCtx{Fctx: ctx}

	err := fctx.ParseJsonToStruct(reqBody, global.SPB_VALIDATOR)
	if err != nil {
		logger.Errorf(msg.ErrParseStructFailed("ForgotPasswordRequest", err))
		return fctx.ErrResponse(msg.REQUEST_BODY_INVALID)
	}

	if err := h.service.ForgotPassword(reqBody.Email); err != nil {
		logger.Errorf(msg.ErrForgotPasswordFailed(err))
		return fctx.ErrResponse(msg.BAD_REQUEST)
	}

	return fctx.JsonResponse(fiber.StatusOK, msg.CODE_SUCCESS)
}
