package middleware

import (
	"slices"

	"spb/bsa/internal/auth/model"
	"spb/bsa/pkg/auth"
	"spb/bsa/pkg/logger"
	"spb/bsa/pkg/msg"
	"spb/bsa/pkg/utils"

	"github.com/gofiber/fiber/v3"
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

		var claims *model.UserClaims
		var errStr string
		claims, err := auth.GetTokenFromHeader(ctx)
		if claims != nil && err == nil {
			ctx.Locals("claims", *claims)
			return ctx.Next()
		} else {
			errStr = err.Error()
		}
		logger.Errorf("error jwt middleware: %v", errStr)

		fctx := utils.FiberCtx{Fctx: ctx}
		return fctx.ErrResponse(msg.UNAUTHORIZED)
	}
}
