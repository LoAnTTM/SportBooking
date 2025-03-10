package handler

import (
	service "spb/bsa/api/club/service"

	"github.com/gofiber/fiber/v3"
)

type IHandler interface {
	GetByID(ctx fiber.Ctx) error
	Create(ctx fiber.Ctx) error
	Update(ctx fiber.Ctx) error
	Delete(ctx fiber.Ctx) error
}

type Handler struct {
	service service.IService
}

// @author: LoanTT
// @function: NewHandler
// @description: Create a new club handler
// @param: club serv
// @return: fiber.Handler
func NewHandler(serv service.IService) IHandler {
	return &Handler{
		service: serv,
	}
}
