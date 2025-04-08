package handler

import (
	"spb/bsa/api/unit/service"

	"github.com/gofiber/fiber/v3"
)

type IHandler interface {
	Update(ctx fiber.Ctx) error
	GetByID(ctx fiber.Ctx) error
	Delete(ctx fiber.Ctx) error
	Create(ctx fiber.Ctx) error
	Search(ctx fiber.Ctx) error
	AddMedia(ctx fiber.Ctx) error
	DeleteMedia(ctx fiber.Ctx) error
}

type Handler struct {
	service service.IService
}

// @author: LoanTT
// @function: NewHandler
// @description: Create a new unit handler
// @param: unit serv
// @return: fiber.Handler
func NewHandler(serv service.IService) IHandler {
	return &Handler{
		service: serv,
	}
}
