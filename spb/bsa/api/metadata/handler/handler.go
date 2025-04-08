package handler

import (
	service "spb/bsa/api/metadata/service"

	"github.com/gofiber/fiber/v3"
)

type IHandler interface {
	GetByKey(ctx fiber.Ctx) error
	Update(ctx fiber.Ctx) error
}

type Handler struct {
	service service.IService
}

// @author: LoanTT
// @function: NewHandler
// @description: Create a new metadata handler
// @param: metadata serv
// @return: IHandler
func NewHandler(serv service.IService) IHandler {
	return &Handler{
		service: serv,
	}
}
