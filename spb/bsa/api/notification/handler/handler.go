package handler

import (
	service "spb/bsa/api/notification/service"

	"github.com/gofiber/fiber/v3"
)

type IHandler interface {
	GetByReceiver(ctx fiber.Ctx) error
	GetBySender(ctx fiber.Ctx) error
}

type Handler struct {
	service service.IService
}

// @author: LoanTT
// @function: NewHandler
// @description: Create a new notification handler
// @param: notification serv
// @return: fiber.Handler
func NewHandler(serv service.IService) IHandler {
	return &Handler{
		service: serv,
	}
}
