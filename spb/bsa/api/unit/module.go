package unit

import (
	handler "spb/bsa/api/unit/handler"
	"spb/bsa/api/unit/service"
	"spb/bsa/pkg/middleware"

	"github.com/gofiber/fiber/v3"

	_ "spb/bsa/pkg/utils"
)

var (
	UnitService service.IService
	UnitHandler handler.IHandler
)

// @author: LoanTT
// @function: LoadModule
// @description: Register unit routes
// @param: router fiber.Router
// @param: customMiddleware middleware.ICustomMiddleware
func LoadModule(router fiber.Router, customMiddleware middleware.ICustomMiddleware) {
	UnitService = service.NewService()
	UnitHandler = handler.NewHandler(UnitService)

	unitRoute := router.Group("/api/v1/units")
	unitRoute.Get("/:id", UnitHandler.GetByID)
	unitRoute.Post("/", UnitHandler.Create, customMiddleware.CheckAccess("unit:create"))
	unitRoute.Put("/:id", UnitHandler.Update, customMiddleware.CheckAccess("unit:update"))
	unitRoute.Delete("/:id", UnitHandler.Delete, customMiddleware.CheckAccess("unit:delete"))
	unitRoute.Get("/", UnitHandler.Search)
}
