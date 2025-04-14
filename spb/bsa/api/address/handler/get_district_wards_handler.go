package handler

import (
	"spb/bsa/api/address/utility"
	"spb/bsa/pkg/logger"
	"spb/bsa/pkg/msg"
	"spb/bsa/pkg/utils"

	"github.com/gofiber/fiber/v3"
)

// GetDistrictWards godoc
//
// @Summary Get all wards in a district
// @Description Get all wards in a district
// @Tags Address
// @Accept json
// @Produce json
// @Param id path string true "District ID"
// @Success 200 {object} utils.JSONResult{} "Get all wards in a district success"
// @Failure 400 {object} utils.JSONResult{} "Get all wards in a district failed"
// @Router /api/v1/districts/{id}/wards [get]
func (h Handler) GetDistrictWards(ctx fiber.Ctx) error {
	var err error
	var districtID string

	fctx := utils.FiberCtx{Fctx: ctx}
	if districtID, err = fctx.ParseUUID("id"); err != nil {
		logger.Errorf(msg.ErrParseUUIDFailed("district", err))
		return fctx.ErrResponse(msg.PARAM_INVALID)
	}

	// Call the service to get the wards for the specified district
	wards, err := h.service.GetDistrictWards(districtID)
	if err != nil {
		return fctx.ErrResponse(msg.BAD_REQUEST)
	}

	response := utility.MapWardEntitiesToResponse(wards)
	// Return the list of wards as a JSON response
	return fctx.JsonResponse(fiber.StatusOK, msg.CODE_SUCCESS, response)
}
