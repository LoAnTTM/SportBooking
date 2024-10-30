package handler

import (
	service "spb/bsa/internal/metadata/service"
)

type Handler struct {
	service *service.Service
}

// @author: LoanTT
// @function: NewHandler
// @description: Create a new metadata handler
// @param: metadata serv
// @return: fiber.Handler
func NewHandler(serv *service.Service) *Handler {
	return &Handler{
		service: serv,
	}
}
