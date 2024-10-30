package middleware

import (
	"slices"

	"spb/bsa/pkg/auth"

	"github.com/gofiber/fiber/v3"
	"github.com/golang-jwt/jwt/v5"
)

// @author: LoanTT
// @function: JwtMiddleware
// @description: Jwt middleware
// @param: ignorePaths []string
// @return: func(c *fiber.Ctx) error
func JwtMiddleware(ignorePaths ...string) fiber.Handler {
	return func(ctx fiber.Ctx) error {
		url := string(ctx.Request().URI().Path())
		if slices.Contains(ignorePaths, url) {
			return ctx.Next()
		}

		var claims jwt.MapClaims
		var errStr string
		claims, err := auth.GetTokenFromHeader(ctx)
		if claims != nil && err == nil {
			ctx.Locals("claims", claims)
			return ctx.Next()
		} else {
			errStr = err.Error()
		}

		return ctx.Status(fiber.StatusUnauthorized).JSON(map[string]string{
			"message": errStr,
		})
	}
}
