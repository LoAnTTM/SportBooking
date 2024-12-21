package middleware

import (
	"spb/bsa/api/auth/model"
	"spb/bsa/pkg/global"
	"spb/bsa/pkg/msg"
	"spb/bsa/pkg/utils"

	"github.com/gofiber/fiber/v3"
)

// @author: LoanTT
// @function: CheckPermissionAccess
// @description: check permission access
// @param: permissionsRequired string
// @return: fiber.Handler
func CheckPermissionAccess(permissionsRequired string) fiber.Handler {
	return func(ctx fiber.Ctx) error {
		fctx := utils.FiberCtx{Fctx: ctx}
		claims := ctx.Locals("claims").(model.UserClaims)
		userPermission := claims.Permission

		// check permission
		if isExist := utils.ContainBit(userPermission, global.SPB_PERMISSIONS[permissionsRequired]); !isExist {
			return fctx.ErrResponse(msg.FORBIDDEN)
		}

		return ctx.Next()
	}
}
