package unit_service

import (
	handler "spb/bsa/internal/unit_service/handler"
	"spb/bsa/internal/unit_service/service"
	"spb/bsa/pkg/middleware"

	"github.com/gofiber/fiber/v3"
)

var (
	UnitServiceService *service.Service
	UnitServiceHandler *handler.Handler
)

// @author: LoanTT
// @function: LoadModule
// @description: Register unitService routes
// @param: router fiber.Router
func LoadModule(router fiber.Router, customMiddleware middleware.ICustomMiddleware) {
	UnitServiceService = service.NewService()
	UnitServiceHandler = handler.NewHandler(UnitServiceService)

	unitServiceRoute := router.Group("/api/v1/unit-services")
	unitServiceRoute.Get("/", UnitServiceHandler.GetAll, customMiddleware.CheckAccess("unit_service:list"))
	unitServiceRoute.Get("/:id", UnitServiceHandler.GetByID, customMiddleware.CheckAccess("unit_service:read"))
	unitServiceRoute.Post("/", UnitServiceHandler.Create, customMiddleware.CheckAccess("unit_service:create"))
	unitServiceRoute.Patch("/:id", UnitServiceHandler.Update, customMiddleware.CheckAccess("unit_service:update"))
	unitServiceRoute.Delete("/:id", UnitServiceHandler.Delete, customMiddleware.CheckAccess("unit_service:delete"))
}
