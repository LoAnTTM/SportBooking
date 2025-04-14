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

// GoogleCallback godoc
//
// @summary 		Google callback api
// @description 	Google callback api
// @tags 			auth
// @accept  		json
// @produce 		json
// @param 			Group body model.GoogleCallbackRequest true 	"Google callback"
// @success 		200 {object} utils.JSONResult{}					"Google callback success"
// @failure 		400 {object} utils.JSONResult{}        			"Google callback failed"
// @router 			/api/auth/google/callback [post]
func (h *Handler) GoogleCallback(ctx fiber.Ctx) error {
	var err error
	reqBody := new(model.GoogleCallbackRequest)

	fctx := utils.FiberCtx{Fctx: ctx}
	if err = fctx.ParseJsonToStruct(reqBody, global.SPB_VALIDATOR); err != nil {
		logger.Errorf(msg.ErrParseStructFailed("GoogleCallbackRequest", err))
		return fctx.ErrResponse(msg.REQUEST_BODY_INVALID)
	}

	user, err := h.service.GoogleLogin(*reqBody)
	if err != nil {
		logger.Errorf(msg.ErrGoogleLoginFailed(err))
		return fctx.ErrResponse(msg.BAD_REQUEST)
	}

	tokens := GenUserTokenResponse(user)
	if tokens == nil {
		logger.Errorf(msg.ErrGenerateTokenFailed(err))
		return fctx.ErrResponse(msg.BAD_REQUEST)
	}

	err = TokenNext(&fctx, ctx, user, tokens)
	if err != nil {
		logger.Errorf(msg.ErrGenerateTokenFailed(err))
		return fctx.ErrResponse(msg.BAD_REQUEST)
	}

	loginResponse := utility.MappingLoginResponse(user, tokens)
	return fctx.JsonResponse(fiber.StatusOK, msg.CODE_SUCCESS, loginResponse)
}
