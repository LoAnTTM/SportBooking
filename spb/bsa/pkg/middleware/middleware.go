package middleware

import (
	"github.com/gofiber/fiber/v3"
)

type CustomMiddleware struct{}

// @author: LoanTT
// @function: CheckJwt
// @description: jwt middleware
// @return: fiber.Handler
// @param: ignorePaths []string
func (cm *CustomMiddleware) CheckJwt(ignorePaths ...string) fiber.Handler {
	return JwtMiddleware(ignorePaths...)
}

// @author: LoanTT
// @function: Log
// @description: log middleware
// @return: fiber.Handler
func (cm *CustomMiddleware) Log() fiber.Handler {
	return LogMiddleware()
}

// @author: LoanTT
// @function: CheckPermissionAccess
// @description: permission middleware
// @return: fiber.Handler
// @param: permissionsRequired string
func (cm *CustomMiddleware) CheckAccess(permissionsRequired string) fiber.Handler {
	return CheckPermissionAccess(permissionsRequired)
}

// @author: LoanTT
// @function: NewCustomMiddleware
// @description: new custom middleware
// @return: *CustomMiddleware
func NewCustomMiddleware() *CustomMiddleware {
	return &CustomMiddleware{}
}
