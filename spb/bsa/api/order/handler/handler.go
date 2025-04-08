package handler

import "spb/bsa/api/order/service"

type IHandler interface{}

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
