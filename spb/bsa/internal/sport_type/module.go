package sport_type

import (
	"spb/bsa/internal/sport_type/service"
	"spb/bsa/pkg/middleware"

	"github.com/gofiber/fiber/v3"
)

var SportTypeService *service.Service

// @author: LoanTT
// @function: LoadModule
// @description: Register sportType routes
// @param: router fiber.Router
// @param: customMiddleware middleware.ICustomMiddleware
func LoadModule(router fiber.Router, customMiddleware middleware.ICustomMiddleware) {
	SportTypeService = service.NewService()
}
