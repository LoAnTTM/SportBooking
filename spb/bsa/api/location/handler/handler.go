package handler

import (
	service "spb/bsa/api/location/service"

	"github.com/gofiber/fiber/v3"
)

type IHandler interface {
	Update(ctx fiber.Ctx) error
	GetAll(ctx fiber.Ctx) error
	Delete(ctx fiber.Ctx) error
	Create(ctx fiber.Ctx) error
}

type Handler struct {
	service service.IService
}

// @author: LoanTT
// @function: NewHandler
// @description: Create a new location handler
// @param: location serv
// @return: fiber.Handler
func NewHandler(serv service.IService) IHandler {
	return &Handler{
		service: serv,
	}
}
