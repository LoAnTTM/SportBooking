package handler

import (
	"spb/bsa/api/address/service"

	"github.com/gofiber/fiber/v3"
)

type IHandler interface {
	GetProvinces(ctx fiber.Ctx) error
	GetProvinceDistricts(ctx fiber.Ctx) error
	GetDistrictWards(ctx fiber.Ctx) error
	GetProvinceByID(ctx fiber.Ctx) error
	GetDistrictByID(ctx fiber.Ctx) error
	GetWardByID(ctx fiber.Ctx) error
}

type Handler struct {
	// service service.IService
	service service.IService
}

func NewHandler(serv service.IService) IHandler {
	return &Handler{
		service: serv,
	}
}
