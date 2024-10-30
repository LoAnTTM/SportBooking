package user

import (
	handler "spb/bsa/internal/user/handler"
	"spb/bsa/internal/user/service"
	"spb/bsa/pkg/middleware"

	"github.com/gofiber/fiber/v3"

	_ "spb/bsa/pkg/utils"
)

var (
	UserService *service.Service
	UserHandler *handler.Handler
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
	userRoute.Get("/", UserHandler.GetAll, customMiddleware.CheckAccess("user:list"))
	userRoute.Get("/:id", UserHandler.GetByID, customMiddleware.CheckAccess("user:read"))
	userRoute.Post("/", UserHandler.Create, customMiddleware.CheckAccess("user:create"))
	userRoute.Patch("/:id", UserHandler.Update, customMiddleware.CheckAccess("user:update"))
	userRoute.Delete("/:id", UserHandler.Delete, customMiddleware.CheckAccess("user:delete"))
}
