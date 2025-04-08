package handler

import (
	"spb/bsa/api/address/utility"
	"spb/bsa/pkg/logger"
	"spb/bsa/pkg/msg"
	"spb/bsa/pkg/utils"

	"github.com/gofiber/fiber/v3"
)

// GetDistrictByID godoc
//
// @Summary Get district by ID
// @Description Get district by ID
// @Tags Address
// @Accept json
// @Produce json
// @Param id path string true "District ID"
// @Success 200 {object} utils.JSONResult{} "Get district by ID success"
// @Failure 400 {object} utils.JSONResult{} "Get district by ID failed"
// @Router /api/v1/districts/{id} [get]
func (h Handler) GetDistrictByID(ctx fiber.Ctx) error {
	// Get the district ID from the URL parameters
	var districtID string
	var err error

	fctx := utils.FiberCtx{Fctx: ctx}
	if districtID, err = fctx.ParseUUID("id"); err != nil {
		logger.Errorf("error parse district id: %v", err)
		return fctx.ErrResponse(msg.BAD_REQUEST)
	}
	// Call the service to get the district by ID
	district, err := h.service.GetDistrictByID(districtID)
	if err != nil {
		return fctx.ErrResponse(msg.BAD_REQUEST)
	}

	response := utility.MapDistrictEntityToResponse(district)
	// Return the district as a JSON response
	return fctx.JsonResponse(fiber.StatusOK, msg.CODE_ALL_LOCATION_SUCCESS, response)
}
