package unit_price

import (
	handler "spb/bsa/internal/unit_price/handler"
	"spb/bsa/internal/unit_price/service"
	"spb/bsa/pkg/middleware"

	"github.com/gofiber/fiber/v3"

	_ "spb/bsa/pkg/utils"
)

var (
	UnitPriceService *service.Service
	UnitPriceHandler *handler.Handler
)

// @author: LoanTT
// @function: LoadModule
// @description: Register unitPrice routes
// @param: router fiber.Router
// @param: customMiddleware middleware.ICustomMiddleware
func LoadModule(router fiber.Router, customMiddleware middleware.ICustomMiddleware) {
	UnitPriceService = service.NewService()
	UnitPriceHandler = handler.NewHandler(UnitPriceService)

	unitPriceRoute := router.Group("/api/v1/unit-prices")
	unitPriceRoute.Get("/", UnitPriceHandler.GetAll, customMiddleware.CheckAccess("unit_price:list"))
	unitPriceRoute.Get("/:id", UnitPriceHandler.GetByID, customMiddleware.CheckAccess("unit_price:read"))
	unitPriceRoute.Post("/", UnitPriceHandler.Create, customMiddleware.CheckAccess("unit_price:create"))
	unitPriceRoute.Patch("/:id", UnitPriceHandler.Update, customMiddleware.CheckAccess("unit_price:update"))
	unitPriceRoute.Delete("/:id", UnitPriceHandler.Delete, customMiddleware.CheckAccess("unit_price:delete"))
}
