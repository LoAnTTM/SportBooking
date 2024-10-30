package location

import (
	handler "spb/bsa/internal/location/handler"
	"spb/bsa/internal/location/service"
	"spb/bsa/pkg/middleware"

	"github.com/gofiber/fiber/v3"

	_ "spb/bsa/pkg/utils"
)

var (
	LocationService *service.Service
	LocationHandler *handler.Handler
)

// @author: LoanTT
// @function: LoadModule
// @description: Register location routes
// @param: router fiber.Router
// @param: customMiddleware middleware.ICustomMiddleware
func LoadModule(router fiber.Router, customMiddleware middleware.ICustomMiddleware) {
	LocationService = service.NewService()
	LocationHandler = handler.NewHandler(LocationService)

	locationRoute := router.Group("/api/v1/locations")
	locationRoute.Get("/", LocationHandler.GetAll)
	locationRoute.Post("/", LocationHandler.Create, customMiddleware.CheckAccess("location:create"))
	locationRoute.Patch("/:id", LocationHandler.Update, customMiddleware.CheckAccess("location:update"))
	locationRoute.Delete("/:id", LocationHandler.Delete, customMiddleware.CheckAccess("location:delete"))
}
