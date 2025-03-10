package handler

import (
	"errors"
	"time"

	"spb/bsa/api/auth/model"
	serv "spb/bsa/api/auth/service"
	"spb/bsa/pkg/auth"
	"spb/bsa/pkg/cache"
	"spb/bsa/pkg/config"
	"spb/bsa/pkg/entities"
	"spb/bsa/pkg/global"
	"spb/bsa/pkg/logger"
	"spb/bsa/pkg/msg"
	"spb/bsa/pkg/utils"

	"github.com/gofiber/fiber/v3"
	"github.com/golang-jwt/jwt/v5"
)

type Handler struct {
	service *serv.Service
}

// @author: LoanTT
// @function: NewHandler
// @description: Create a new auth handler
// @param: auth service
// @return: fiber.Handler
func NewHandler(service *serv.Service) *Handler {
	return &Handler{
		service: service,
	}
}

// @author: LoanTT
// @function: SetRefreshTokenToCookie
// @description: set token to cookie
// @param: user model.LoginResponse
// @param: ctx fiber.Ctx
// @return: err error
func SetRefreshTokenToCookie(tokens map[string]string, ctx fiber.Ctx) error {
	if tokens[config.ACCESS_TOKEN_NAME] == "" || tokens[config.REFRESH_TOKEN_NAME] == "" {
		return msg.ErrMissingToken
	}
	expires := time.Now().Add(time.Minute * time.Duration(global.SPB_CONFIG.JWT.RefreshTokenExp))
	cookie := &fiber.Cookie{
		Name:     config.REFRESH_TOKEN_NAME,
		Value:    tokens[config.REFRESH_TOKEN_NAME],
		Expires:  expires,
		HTTPOnly: true,
		Secure:   global.IsProd(),
		Path:     "/",
	}
	ctx.Cookie(cookie)
	return nil
}

// @author: LoanTT
// @function: GenUserTokenResponse
// @description: generate token response (access token and refresh token)
// @param: user entities.User
// @return: map[string]string {accessToken, refreshToken}
func GenUserTokenResponse(user *entities.User) map[string]string {
	accessClaims := GenerateUserToken(user, config.ACCESS_TOKEN_NAME)
	refreshClaims := GenerateUserToken(user, config.REFRESH_TOKEN_NAME)

	accessToken, accessErr := accessClaims.SignedString([]byte(global.SPB_CONFIG.JWT.Secret))
	refreshToken, refreshErr := refreshClaims.SignedString([]byte(global.SPB_CONFIG.JWT.Secret))
	if accessErr != nil || refreshErr != nil {
		logger.Errorf(msg.ErrGenerateToken(errors.Join(accessErr, refreshErr).Error()).Error())
		return nil
	}

	return map[string]string{
		config.ACCESS_TOKEN_NAME:  accessToken,
		config.REFRESH_TOKEN_NAME: refreshToken,
	}
}

// @author: LoanTT
// @function: GenerateUserToken
// @description: generate token with claims
// @param: user entities.User
// @param: tokenType string
// @return: *jwt.Token
func GenerateUserToken(user *entities.User, tokenType string) *jwt.Token {
	var duration time.Duration

	if tokenType == config.REFRESH_TOKEN_NAME {
		duration = time.Minute * time.Duration(global.SPB_CONFIG.JWT.RefreshTokenExp)
	} else if tokenType == config.ACCESS_TOKEN_NAME {
		duration = time.Minute * time.Duration(global.SPB_CONFIG.JWT.AccessTokenExp)
	}
	expireTime := &jwt.NumericDate{Time: time.Now().Add(duration)}

	claims := &model.UserClaims{
		UserID:     user.ID,
		Email:      user.Email,
		Role:       user.Role.Name,
		Permission: user.Role.PermissionBit,
		RegisteredClaims: jwt.RegisteredClaims{
			Issuer:    user.ID,
			ExpiresAt: expireTime,
		},
	}
	return auth.GetToken(claims)
}

// @author: LoanTT
// @function: TokenNext
// @description: set refresh token to cookie and cache
// @param: fctx *utils.FiberCtx
// @param: ctx fiber.Ctx
// @param: user *entities.User
// @param: tokens map[string]string
// @return: err error
func TokenNext(fctx *utils.FiberCtx, ctx fiber.Ctx, user *entities.User, tokens map[string]string) error {
	cacheKey := config.AUTH_REFRESH_TOKEN + user.Email
	prevToken, err := cache.Jwt.GetJwt(cacheKey)
	jwtExpire := global.SPB_CONFIG.JWT.RefreshTokenExp

	switch {
	// first time login
	case err == nil && prevToken == "":
		if err := cache.Jwt.SetJwt(cacheKey, tokens[config.REFRESH_TOKEN_NAME], jwtExpire); err != nil {
			return logger.RErrorf("error set token to cache: %v", err)
		}
		if err := SetRefreshTokenToCookie(tokens, ctx); err != nil {
			return err
		}

	// error get token from cache
	case err != nil:
		return logger.RErrorf("error get token to cache: %v", err)

	// refresh token
	case prevToken != "":
		blPrevToken := config.AUTH_REFRESH_TOKEN_BLACKLIST + prevToken
		if err := cache.Jwt.SetToBlackList(blPrevToken, global.SPB_CONFIG.JWT.RefreshTokenExp); err != nil {
			return logger.RErrorf("error set token to cache: %v", err)
		}
		if err := cache.Jwt.SetJwt(cacheKey, tokens[config.REFRESH_TOKEN_NAME], jwtExpire); err != nil {
			return logger.RErrorf("error set token to cache: %v", err)
		}
		if err := SetRefreshTokenToCookie(tokens, ctx); err != nil {
			return err
		}
	}

	return nil
}
