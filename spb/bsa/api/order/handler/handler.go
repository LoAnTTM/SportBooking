package handler

import (
	"spb/bsa/api/order/service"

	"github.com/gofiber/fiber/v3"
)

type IHandler interface {
	Pay(ctx fiber.Ctx) error
	ZaloPayCallback(ctx fiber.Ctx) error
	GetByUserID(ctx fiber.Ctx) error
}

type Handler struct {
	service service.IService
}

// @author: LoanTT
// @function: NewHandler
// @description: Create a new order handler
// @param: order service
// @return: fiber.Handler
func NewHandler(serv service.IService) IHandler {
	return &Handler{
		service: serv,
	}
}
