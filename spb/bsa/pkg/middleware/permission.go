package middleware

import (
	"spb/bsa/pkg/utils"

	"github.com/gofiber/fiber/v3"
	"github.com/golang-jwt/jwt/v5"
)

var ErrForbidden = fiber.NewError(fiber.StatusForbidden, "forbidden")

// @author: LoanTT
// @function: CheckPermissionAccess
// @description: check permission access
// @param: permissionsRequired string
// @return: fiber.Handler
func CheckPermissionAccess(permissionsRequired string) fiber.Handler {
	return func(ctx fiber.Ctx) error {
		fctx := utils.FiberCtx{Fctx: ctx}
		claims := ctx.Locals("claims").(jwt.MapClaims)
		userPermission := claims["permissions"].(map[string]int)

		// check permission
		if _, isExist := userPermission[permissionsRequired]; !isExist {
			return fctx.ErrResponse(ErrForbidden)
		}

		return ctx.Next()
	}
}
