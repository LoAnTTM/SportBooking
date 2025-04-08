package sport_type

import (
	"spb/bsa/api/sport_type/handler"
	"spb/bsa/api/sport_type/service"
	"spb/bsa/pkg/middleware"

	"github.com/gofiber/fiber/v3"
)

var (
	SportTypeService service.IService
	SportTypeHandler handler.IHandler
)

// @author: LoanTT
// @function: LoadModule
// @description: Register sportType routes
// @param: router fiber.Router
// @param: customMiddleware middleware.ICustomMiddleware
func LoadModule(router fiber.Router, customMiddleware middleware.ICustomMiddleware) {
	SportTypeService = service.NewService()
	SportTypeHandler = handler.NewHandler(SportTypeService)

	sportTypeRoute := router.Group("/api/v1/sport-types")
	sportTypeRoute.Get("/", SportTypeHandler.GetAll, customMiddleware.CheckAccess("sport_type:list"))
	sportTypeRoute.Get("/:id", SportTypeHandler.GetByID, customMiddleware.CheckAccess("sport_type:read"))
	sportTypeRoute.Post("/", SportTypeHandler.Create, customMiddleware.CheckAccess("sport_type:create"))
	sportTypeRoute.Put("/:id", SportTypeHandler.Update, customMiddleware.CheckAccess("sport_type:update"))
	sportTypeRoute.Delete("/:id", SportTypeHandler.Delete, customMiddleware.CheckAccess("sport_type:delete"))
}
