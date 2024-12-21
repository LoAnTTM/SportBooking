package handler

import (
	"spb/bsa/api/auth/model"
	"spb/bsa/pkg/global"
	"spb/bsa/pkg/logger"
	"spb/bsa/pkg/msg"
	"spb/bsa/pkg/utils"

	"github.com/gofiber/fiber/v3"
)

// ResetPassword godoc
//
// @summary		Reset password api
// @description	Reset password api
// @tags	 	auth
// @accept		json
// @produce		json
// @param		group body model.ResetPasswordRequest true  "Reset password"
// @success		200 {object} utils.JSONResult{}				"Reset password success"
// @failure		400 {object} utils.JSONResult{}				"Reset password failed"
// @router		/api/v1/auth/reset-password [post]
func (h *Handler) ResetPassword(ctx fiber.Ctx) error {
	// parse request
	reqBody := new(model.ResetPasswordRequest)
	fctx := utils.FiberCtx{Fctx: ctx}

	if err := fctx.ParseJsonToStruct(reqBody, global.SPB_VALIDATOR); err != nil {
		logger.Errorf("parse json to struct failed: %v", err)
		return fctx.ErrResponse(msg.RESET_PASSWORD_INCORRECT)
	}

	if err := h.service.ResetPassword(reqBody); err != nil {
		logger.Errorf("reset password failed: %v", err)
		return fctx.ErrResponse(msg.RESET_PASSWORD_INCORRECT)
	}

	return fctx.JsonResponse(fiber.StatusOK, msg.CODE_RESET_PASSWORD_SUCCESS)
}
