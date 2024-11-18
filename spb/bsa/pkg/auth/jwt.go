package auth

import (
	"strings"
	"time"

	"spb/bsa/internal/auth/model"
	"spb/bsa/pkg/config"
	"spb/bsa/pkg/global"
	"spb/bsa/pkg/msg"

	"github.com/gofiber/fiber/v3"
	"github.com/golang-jwt/jwt/v5"
)

// @author: LoanTT
// @function: ParseJwt
// @description: Parse token to *model.UserClaims
// @param: token string
// @return: *model.UserClaims, error
func ParseJwt(token string) (*model.UserClaims, error) {
	tokenPaths := strings.Split(token, config.JWT_PREFIX)

	if len(tokenPaths) != 2 {
		return nil, msg.ErrInvalidToken
	}

	tokenValue := tokenPaths[1]
	jwtToken, err := jwt.ParseWithClaims(tokenValue, &model.UserClaims{}, func(token *jwt.Token) (interface{}, error) {
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, msg.ErrUnexpectedSignMethod(token.Header["alg"])
		}
		secret := global.SPB_CONFIG.JWT.Secret
		return []byte(secret), nil
	})
	if err != nil {
		return nil, err
	}

	claims, ok := jwtToken.Claims.(*model.UserClaims)
	if claims.ExpiresAt.Compare(time.Now()) == -1 {
		return claims, msg.ErrTokenExpired
	}

	if !ok && !jwtToken.Valid {
		return claims, msg.ErrUnauthorized
	}

	return claims, nil
}

// @author: LoanTT
// @function: GetToken
// @description: Create token
// @param: claims jwt.Claims
// @return: *jwt.Token
func GetToken(claims jwt.Claims) *jwt.Token {
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	return token
}

// @author: LoanTT
// @function: GetTokenFromCookie
// @description: Get token from cookie
// @param: ctx fiber.Ctx
// @return: *model.UserClaims, error
func GetTokenFromCookie(ctx fiber.Ctx) (*model.UserClaims, error) {
	jwtCookie := ctx.Cookies(config.ACCESS_TOKEN_NAME)
	if jwtCookie == "" {
		return nil, msg.ErrAccessKeyNotFound
	}

	accessToken := config.JWT_PREFIX + jwtCookie
	claims, err := ParseJwt(accessToken)
	if err != nil {
		return nil, msg.ErrParseTokenFromCookie(err)
	}

	return claims, nil
}

// @author: LoanTT
// @function: GetTokenFromHeader
// @description: Get token from header
// @param: ctx fiber.Ctx
// @return: *model.UserClaims, error
func GetTokenFromHeader(ctx fiber.Ctx) (*model.UserClaims, error) {
	jwtHeader := ctx.Get("Authorization")
	if jwtHeader == "" {
		return nil, msg.ErrAccessKeyNotFound
	}

	claims, err := ParseJwt(jwtHeader)
	if err != nil {
		return nil, msg.ErrParseTokenFromHeader(err)
	}

	return claims, nil
}
