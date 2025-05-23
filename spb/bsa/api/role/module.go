package role

import (
	"spb/bsa/api/role/service"
	"spb/bsa/pkg/middleware"

	"github.com/gofiber/fiber/v3"
)

var RoleService service.IService

// @author: LoanTT
// @function: LoadModule
// @description: Register user routes
// @param: router fiber.Router
// @param: customMiddleware middleware.ICustomMiddleware
func LoadModule(router fiber.Router, customMiddleware middleware.ICustomMiddleware) {
	RoleService = service.NewService()
}
