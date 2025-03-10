package payment_info

import (
	"spb/bsa/api/payment_info/service"
	"spb/bsa/pkg/middleware"

	"github.com/gofiber/fiber/v3"
)

var PaymentInfoService *service.Service

// @author: LoanTT
// @function: LoadModule
// @description: Register PaymentInfo routes
// @param: router fiber.Router
// @param: customMiddleware middleware.ICustomMiddleware
func LoadModule(router fiber.Router, customMiddleware middleware.ICustomMiddleware) {
	PaymentInfoService = service.NewService()
}
