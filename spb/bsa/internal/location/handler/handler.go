package handler

import (
	service "spb/bsa/internal/location/service"
)

type Handler struct {
	service *service.Service
}

// @author: LoanTT
// @function: NewHandler
// @description: Create a new location handler
// @param: location serv
// @return: fiber.Handler
func NewHandler(serv *service.Service) *Handler {
	return &Handler{
		service: serv,
	}
}
