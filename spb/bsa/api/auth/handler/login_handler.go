package handler

import (
	"spb/bsa/api/auth/model"
	"spb/bsa/api/auth/utility"
	"spb/bsa/pkg/global"
	"spb/bsa/pkg/logger"
	"spb/bsa/pkg/msg"
	"spb/bsa/pkg/utils"

	"github.com/gofiber/fiber/v3"
)

// AccountLogin godoc
//
// @summary		Login api
// @description	Login api
// @tags	 	auth
// @accept		json
// @produce		json
// @param		group body model.LoginRequest true 						"Login"
// @success		200 {object} utils.JSONResult{data=model.LoginResponse}	"Login success"
// @failure		400 {object} utils.JSONResult{}							"Login failed"
// @router		/api/v1/auth/login [post]
func (h *Handler) AccountLogin(ctx fiber.Ctx) error {
	var err error
	reqBody := new(model.LoginRequest)

	fctx := utils.FiberCtx{Fctx: ctx}
	if err = fctx.ParseJsonToStruct(reqBody, global.SPB_VALIDATOR); err != nil {
		logger.Errorf(msg.ErrParseStructFailed("LoginRequest", err))
		return fctx.ErrResponse(msg.REQUEST_BODY_INVALID)
	}

	user, err := h.service.AccountLogin(reqBody)
	if err != nil {
		logger.Errorf(msg.ErrLoginFailed(err))
		return fctx.ErrResponse(msg.BAD_REQUEST)
	}

	tokens := GenUserTokenResponse(user)
	if tokens == nil {
		logger.Errorf(msg.ErrGenerateTokenFailed(err))
		return fctx.ErrResponse(msg.SERVER_ERROR)
	}

	err = TokenNext(&fctx, ctx, user, tokens)
	if err != nil {
		logger.Errorf(msg.ErrSetTokenToCookie(err))
		return fctx.ErrResponse(msg.SERVER_ERROR)
	}

	loginResponse := utility.MappingLoginResponse(user, tokens)
	return fctx.JsonResponse(fiber.StatusOK, msg.CODE_SUCCESS, loginResponse)
}
