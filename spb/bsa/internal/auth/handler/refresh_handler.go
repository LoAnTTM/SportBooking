package handler

import (
	"spb/bsa/internal/auth/utility"
	"spb/bsa/pkg/auth"
	"spb/bsa/pkg/cache"
	"spb/bsa/pkg/config"
	"spb/bsa/pkg/global"
	"spb/bsa/pkg/logger"
	"spb/bsa/pkg/msg"
	"spb/bsa/pkg/utils"

	"github.com/gofiber/fiber/v3"
)

// AccountRefreshToken godoc
//
// @summary		Refresh token api
// @description	Refresh token api
// @tags		auth
// @accept		json
// @produce		json
// @success		200 {object} utils.JSONResult{data=model.LoginResponse}	"Refresh token success"
// @failure		400 {object} utils.JSONResult{}							"Refresh token failed"
// @router		/api/v1/auth/refresh [post]
func (h *Handler) AccountRefreshToken(ctx fiber.Ctx) error {
	fctx := utils.FiberCtx{Fctx: ctx}

	prevRefreshToken := ctx.Cookies(config.REFRESH_TOKEN_NAME)
	refreshTokenFull := config.JWT_PREFIX + prevRefreshToken

	claims, err := auth.ParseJwt(refreshTokenFull)
	if err != nil {
		logger.Errorf("error parse json to struct: %v", err)
		return fctx.ErrResponse(msg.REFRESH_TOKEN_FAILED)
	}
	if cache.JwtCacheApp.IsBlackListed(prevRefreshToken) {
		logger.Errorf("refresh token is blacklisted: %v", prevRefreshToken)
		return fctx.ErrResponse(msg.REFRESH_TOKEN_FAILED)
	}
	user, err := h.service.RefreshToken(refreshTokenFull, claims)
	if err != nil {
		logger.Errorf("get user failed: %v", err)
		return fctx.ErrResponse(msg.REFRESH_TOKEN_FAILED)
	}
	tokens := GenUserTokenResponse(user)
	if tokens == nil {
		logger.Errorf("gen user tokens failed: %v", err)
		return fctx.ErrResponse(msg.SERVER_ERROR)
	}
	err = TokenNext(&fctx, ctx, user, tokens)
	if err != nil {
		logger.Errorf("set token to cookie failed: %v", err)
		return fctx.ErrResponse(msg.SERVER_ERROR)
	}
	err = cache.JwtCacheApp.SetToBlackList(prevRefreshToken, global.SPB_CONFIG.JWT.ExpireCache)
	if err != nil {
		logger.Errorf("set prev refresh token to black list failed: %v", err)
		return fctx.ErrResponse(msg.SERVER_ERROR)
	}

	refreshResponse := utility.MappingRefreshResponse(tokens)
	return fctx.JsonResponse(fiber.StatusOK, msg.CODE_REFRESH_TOKEN_SUCCESS, refreshResponse)
}
