package user

import (
	handler "spb/bsa/api/user/handler"
	"spb/bsa/api/user/service"
	"spb/bsa/pkg/middleware"

	"github.com/gofiber/fiber/v3"

	_ "spb/bsa/pkg/utils"
)

var (
	UserService service.IService
	UserHandler handler.IHandler
)

// @author: LoanTT
// @function: LoadModule
// @description: Register user routes
// @param: router fiber.Router
// @param: customMiddleware middleware.ICustomMiddleware
func LoadModule(router fiber.Router, customMiddleware middleware.ICustomMiddleware) {
	UserService = service.NewService()
	UserHandler = handler.NewHandler(UserService)

	userRoute := router.Group("/api/v1/users")
	userRoute.Get("/:id", UserHandler.GetByID, customMiddleware.CheckAccess("user:read"))
	userRoute.Put("/:id", UserHandler.Update, customMiddleware.CheckAccess("user:update"))
}
