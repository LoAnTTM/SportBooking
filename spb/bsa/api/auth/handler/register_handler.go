package handler

import (
	"spb/bsa/api/auth/model"
	"spb/bsa/api/auth/service"
	"spb/bsa/pkg/global"
	"spb/bsa/pkg/logger"
	"spb/bsa/pkg/msg"
	"spb/bsa/pkg/utils"

	"github.com/gofiber/fiber/v3"
)

// Accountlogin godoc
//
// @summary		Register new user api
// @description	Register new user api
// @tags		auth
// @accept		json
// @produce		json
// @param	  	group body model.RegisterRequest true 	"Register"
// @success		200 {object} utils.JSONResult{}			"Register success"
// @failure		400 {object} utils.JSONResult{}			"Register failed"
// @failure		400 {object} utils.JSONResult{}			"Register email verifying"
// @router		/api/v1/auth/register [post]
func (h *Handler) AccountRegister(ctx fiber.Ctx) error {
	reqBody := new(model.RegisterRequest)

	fctx := utils.FiberCtx{Fctx: ctx}
	if err := fctx.ParseJsonToStruct(reqBody, global.SPB_VALIDATOR); err != nil {
		logger.Errorf(msg.ErrParseStructFailed("RegisterRequest", err))
		return fctx.ErrResponse(msg.REQUEST_BODY_INVALID)
	}

	status, err := h.service.AccountRegister(reqBody)
	if err != nil {
		logger.Errorf(msg.ErrRegisterFailed(err))
		return fctx.ErrResponse(msg.BAD_REQUEST)
	}

	switch status {
	case service.AccountExisted:
		return fctx.ErrResponse(msg.BAD_REQUEST)
	}

	return fctx.JsonResponse(fiber.StatusOK, msg.CODE_SUCCESS)
}
