package handler

import (
	"spb/bsa/api/auth/utility"
	um "spb/bsa/api/user"
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
	blRefreshToken := config.AUTH_REFRESH_TOKEN_BLACKLIST + prevRefreshToken

	claims, err := auth.ParseJwt(refreshTokenFull)
	if err != nil {
		logger.Errorf(msg.ErrParseStructFailed("UserClaim", err))
		return fctx.ErrResponse(msg.REQUEST_BODY_INVALID)
	}

	if cache.Jwt.IsBlackListed(blRefreshToken) {
		logger.Errorf(msg.ErrInBlackList("RefreshToken"))
		return fctx.ErrResponse(msg.REFRESH_TOKEN_EXPIRED)
	}

	user, err := um.UserService.GetByEmail(claims.Email)
	if err != nil {
		logger.Errorf(msg.ErrGetFailed("User", err))
		return fctx.ErrResponse(msg.BAD_REQUEST)
	}

	tokens := GenUserTokenResponse(user)
	if tokens == nil {
		logger.Errorf(msg.ErrGenerateTokenFailed(err))
		return fctx.ErrResponse(msg.BAD_REQUEST)
	}

	err = TokenNext(&fctx, ctx, user, tokens)
	if err != nil {
		logger.Errorf(msg.ErrSetTokenToCookie(err))
		return fctx.ErrResponse(msg.BAD_REQUEST)
	}

	err = cache.Jwt.SetToBlackList(blRefreshToken, global.SPB_CONFIG.JWT.RefreshTokenExp)
	if err != nil {
		logger.Errorf(msg.ErrSetBlacklistFailed("RefreshToken", err))
		return fctx.ErrResponse(msg.BAD_REQUEST)
	}

	refreshResponse := utility.MappingRefreshResponse(tokens)
	return fctx.JsonResponse(fiber.StatusOK, msg.CODE_SUCCESS, refreshResponse)
}
