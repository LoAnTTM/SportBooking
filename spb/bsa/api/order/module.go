package order

import (
	"spb/bsa/api/order/handler"
	"spb/bsa/api/order/service"
	"spb/bsa/pkg/middleware"

	"github.com/gofiber/fiber/v3"
)

var (
	OrderService service.IService
	OrderHandler handler.IHandler
)

// @author: LoanTT
// @function: LoadModule
// @description: register order routes
// @param: router fiber.Router
// @param: customMiddleware middleware.ICustomMiddleware
func LoadModule(router fiber.Router, customMiddleware middleware.ICustomMiddleware) {
	OrderService = service.NewService()
	OrderHandler = handler.NewHandler(OrderService)

	_ = router.Group("/api/v1/orders")
}
