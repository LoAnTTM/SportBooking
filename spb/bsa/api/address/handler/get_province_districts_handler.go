package handler

import (
	"spb/bsa/api/address/utility"
	"spb/bsa/pkg/logger"
	"spb/bsa/pkg/msg"
	"spb/bsa/pkg/utils"

	"github.com/gofiber/fiber/v3"
)

// GetProvinceByID godoc
//
// @Summary Get province by ID
// @Description Get province by ID
// @Tags Address
// @Accept json
// @Produce json
// @Param id path string true "Province ID"
// @Success 200 {object} utils.JSONResult{} "Get province by ID success"
// @Failure 400 {object} utils.JSONResult{} "Get province by ID failed"
// @Router /api/v1/provinces/{id}/districts [get]
func (h Handler) GetProvinceDistricts(ctx fiber.Ctx) error {
	var err error
	var provinceID string

	fctx := utils.FiberCtx{Fctx: ctx}
	if provinceID, err = fctx.ParseUUID("id"); err != nil {
		logger.Errorf(msg.ErrParseUUIDFailed("province", err))
		return fctx.ErrResponse(msg.PARAM_INVALID)
	}
	// Call the service to get the districts for the specified province
	districts, err := h.service.GetProvinceDistricts(provinceID)
	if err != nil {
		return fctx.ErrResponse(msg.BAD_REQUEST)
	}

	response := utility.MapDistrictEntitiesToResponse(districts)
	// Return the list of districts as a JSON response
	return fctx.JsonResponse(fiber.StatusOK, msg.CODE_SUCCESS, response)
}
