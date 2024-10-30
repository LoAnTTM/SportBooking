package handler

import (
	"spb/bsa/internal/auth/model"
	"spb/bsa/internal/auth/utility"
	"spb/bsa/pkg/global"
	"spb/bsa/pkg/logger"
	"spb/bsa/pkg/utils"

	"github.com/gofiber/fiber/v3"
)

var ErrLoginFailed = fiber.NewError(fiber.StatusBadRequest, "email or password is wrong")

// AccountLogin godoc
//
// @summary		login
// @description	login
// @tags	 	auth
// @accept		json
// @produce		json
// @param		group body model.LoginRequest true "login"
// @success		200 {object} utils.JSONResult{data=model.LoginResponse}	"login success"
// @failure		400 {object} utils.ErrorResult{message=string}			"login failed"
// @router		/api/v1/auth/login [post]
func (h *Handler) AccountLogin(ctx fiber.Ctx) error {
	var err error
	reqBody := new(model.LoginRequest)

	fctx := utils.FiberCtx{Fctx: ctx}
	if err = fctx.ParseJsonToStruct(reqBody, global.SPB_VALIDATOR); err != nil {
		logger.Errorf("error parse json to struct: %v", err)
		return fctx.ErrResponse(ErrLoginFailed)
	}
	user, err := h.service.AccountLogin(reqBody)
	if err != nil {
		logger.Errorf("error login: %v", err)
		return fctx.ErrResponse(ErrLoginFailed)
	}
	tokens := GenUserTokenResponse(user)
	if tokens == nil {
		logger.Errorf("gen user tokens failed: %v", err)
		return fctx.ErrResponse(ErrLoginFailed)
	}
	err = TokenNext(&fctx, ctx, user, tokens)
	if err != nil {
		logger.Errorf("set token to cookie failed: %v", err)
		return fctx.ErrResponse(ErrLoginFailed)
	}

	loginResponse := utility.MappingLoginResponse(user, tokens)
	return fctx.JsonResponse(fiber.StatusOK, loginResponse)
}
