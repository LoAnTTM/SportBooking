package handler

import (
	service "spb/bsa/api/user/service"

	"github.com/gofiber/fiber/v3"
)

type IHandler interface {
	Create(ctx fiber.Ctx) error
	Delete(ctx fiber.Ctx) error
	GetAll(ctx fiber.Ctx) error
	GetByID(ctx fiber.Ctx) error
	Update(ctx fiber.Ctx) error
}

type Handler struct {
	service service.IService
}

// @author: LoanTT
// @function: NewHandler
// @description: Create a new user handler
// @param: user service
// @return: fiber.Handler
func NewHandler(serv service.IService) IHandler {
	return &Handler{
		service: serv,
	}
}
