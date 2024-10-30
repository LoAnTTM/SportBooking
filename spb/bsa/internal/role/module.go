package role

import (
	"spb/bsa/internal/role/service"
	"spb/bsa/pkg/middleware"

	"github.com/gofiber/fiber/v3"
)

var RoleService *service.Service

// @author: LoanTT
// @function: LoadModule
// @description: Register user routes
// @param: router fiber.Router
// @param: customMiddleware middleware.ICustomMiddleware
func LoadModule(router fiber.Router, customMiddleware middleware.ICustomMiddleware) {
	RoleService = service.NewService()
}
