package handler

import (
	"spb/bsa/pkg/auth"
	"spb/bsa/pkg/cache"
	"spb/bsa/pkg/config"
	"spb/bsa/pkg/global"
	"spb/bsa/pkg/logger"
	"spb/bsa/pkg/msg"
	"spb/bsa/pkg/utils"

	"github.com/gofiber/fiber/v3"
)

// AccountLogout godoc
//
// @Summary Logout api
// @Description Logout api
// @Tags 	auth
// @Accept 	json
// @Produce json
// @Success 200 {object} utils.JSONResult{data=string} "Logout success"
// @Failure 400 {object} utils.JSONResult{} "Logout failed"
// @Router /api/v1/auth/logout [post]
func (h *Handler) AccountLogout(ctx fiber.Ctx) error {
	fctx := utils.FiberCtx{Fctx: ctx}

	refreshToken := ctx.Cookies(config.REFRESH_TOKEN_NAME)
	refreshTokenFull := config.JWT_PREFIX + refreshToken
	blRefreshToken := config.AUTH_REFRESH_TOKEN_BLACKLIST + refreshToken

	claims, err := auth.ParseJwt(refreshTokenFull)
	if err != nil {
		logger.Errorf(msg.ErrParseStructFailed("UserClaim", err))
		return fctx.ErrResponse(msg.BAD_REQUEST)
	}
	cache.Jwt.DelJwt(config.AUTH_REFRESH_TOKEN + claims.Email)
	cache.Jwt.SetToBlackList(blRefreshToken, global.SPB_CONFIG.JWT.RefreshTokenExp)

	return fctx.JsonResponse(fiber.StatusOK, msg.CODE_SUCCESS)
}
