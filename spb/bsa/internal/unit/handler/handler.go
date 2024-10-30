package handler

import (
	service "spb/bsa/internal/unit/service"
)

type Handler struct {
	service *service.Service
}

// @author: LoanTT
// @function: NewHandler
// @description: Create a new unit handler
// @param: unit serv
// @return: fiber.Handler
func NewHandler(serv *service.Service) *Handler {
	return &Handler{
		service: serv,
	}
}
