package handler

import (
	"spb/bsa/api/address/utility"
	"spb/bsa/pkg/logger"
	"spb/bsa/pkg/msg"
	"spb/bsa/pkg/utils"

	"github.com/gofiber/fiber/v3"
)

// GetWardByID godoc
//
// @Summary Get ward by ID
// @Description Get ward by ID
// @Tags Address
// @Accept json
// @Produce json
// @Param id path string true "Ward ID"
// @Success 200 {object} utils.JSONResult{} "Get ward by ID success"
// @Failure 400 {object} utils.JSONResult{} "Get ward by ID failed"
// @Router /api/v1/wards/{id} [get]
func (h Handler) GetWardByID(ctx fiber.Ctx) error {
	var err error
	var wardId string

	fctx := utils.FiberCtx{Fctx: ctx}
	if wardId, err = fctx.ParseUUID("id"); err != nil {
		logger.Errorf("error parse district id: %v", err)
		return fctx.ErrResponse(msg.BAD_REQUEST)
	}
	// Call the service to get the province by ID
	ward, err := h.service.GetWardByID(wardId)
	if err != nil {
		return fctx.ErrResponse(msg.BAD_REQUEST)
	}

	response := utility.MapWardEntityToResponse(ward)
	// Return the province as a JSON response
	return fctx.JsonResponse(fiber.StatusOK, msg.CODE_ALL_LOCATION_SUCCESS, response)
}
