package address

import (
	"spb/bsa/api/address/handler"
	"spb/bsa/api/address/service"
	"spb/bsa/pkg/middleware"
	_ "spb/bsa/pkg/utils"

	"github.com/gofiber/fiber/v3"
)

var (
	AddressService service.IService
	AddressHandler handler.IHandler
)

// @author: LoanTT
// @function: LoadModule
// @description: Register address routes
// @param: router fiber.Router
// @param: customMiddleware middleware.ICustomMiddleware
func LoadModule(router fiber.Router, customMiddleware middleware.ICustomMiddleware) {
	AddressService = service.NewService()
	AddressHandler = handler.NewHandler(AddressService)

	addressRoute := router.Group("/api/v1/addresses")
	addressRoute.Get("/provinces", AddressHandler.GetProvinces)
	addressRoute.Get("/provinces/:id", AddressHandler.GetProvinceByID)
	addressRoute.Get("/provinces/:id/districts", AddressHandler.GetProvinceDistricts)
	addressRoute.Get("/districts/:id", AddressHandler.GetDistrictByID)
	addressRoute.Get("/districts/:id/wards", AddressHandler.GetDistrictWards)
	addressRoute.Get("/wards/:id", AddressHandler.GetWardByID)
}
