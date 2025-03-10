package club

import (
	handler "spb/bsa/api/club/handler"
	"spb/bsa/api/club/service"
	"spb/bsa/pkg/middleware"

	"github.com/gofiber/fiber/v3"

	_ "spb/bsa/pkg/utils"
)

var (
	ClubService service.IService
	ClubHandler handler.IHandler
)

// @author: LoanTT
// @function: LoadModule
// @description: Register club routes
// @param: router fiber.Router
// @param: customMiddleware middleware.ICustomMiddleware
func LoadModule(router fiber.Router, customMiddleware middleware.ICustomMiddleware) {
	ClubService = service.NewService()
	ClubHandler = handler.NewHandler(ClubService)

	clubRoute := router.Group("/api/v1/clubs")
	clubRoute.Get("/:id", ClubHandler.GetByID)
	clubRoute.Post("/", ClubHandler.Create, customMiddleware.CheckAccess("club:create"))
	clubRoute.Put("/:id", ClubHandler.Update, customMiddleware.CheckAccess("club:update"))
	clubRoute.Delete("/:id", ClubHandler.Delete, customMiddleware.CheckAccess("club:delete"))
}
