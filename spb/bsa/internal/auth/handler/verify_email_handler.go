package handler

import (
	"spb/bsa/internal/auth/model"
	"spb/bsa/pkg/global"
	"spb/bsa/pkg/logger"
	"spb/bsa/pkg/msg"
	"spb/bsa/pkg/utils"

	"github.com/gofiber/fiber/v3"
)

// VerifyEmail godoc
//
// @summary		Verify email api
// @description	Verify email api
// @tags		auth
// @accept		json
// @produce		json
// @param	  	group body model.VerifyEmailRequest true "Verify email"
// @success		200 {object} utils.JSONResult{}			 "Email verification success"
// @failure		400 {object} utils.JSONResult{}			 "Verify token error"
// @router		/api/v1/auth/verify-email [post]
func (h *Handler) VerifyEmail(ctx fiber.Ctx) error {
	reqBody := new(model.VerifyEmailRequest)
	fctx := utils.FiberCtx{Fctx: ctx}

	if err := fctx.ParseJsonToStruct(reqBody, global.SPB_VALIDATOR); err != nil {
		logger.Errorf("error parse json to struct: %v", err)
		return fctx.ErrResponse(msg.VERIFY_TOKEN_FAILED)
	}

	if err := h.service.VerifyEmail(reqBody); err != nil {
		logger.Errorf("error verify email: %v", err)
		return fctx.ErrResponse(msg.VERIFY_TOKEN_FAILED)
	}
	return fctx.JsonResponse(fiber.StatusOK, msg.CODE_VERIFY_TOKEN_SUCCESS)
}
