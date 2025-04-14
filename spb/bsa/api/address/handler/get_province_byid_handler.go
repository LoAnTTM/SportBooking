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
// @Router /api/v1/provinces/{id} [get]
func (h Handler) GetProvinceByID(ctx fiber.Ctx) error {
	var err error
	var provinceID string

	fctx := utils.FiberCtx{Fctx: ctx}
	if provinceID, err = fctx.ParseUUID("id"); err != nil {
		logger.Errorf(msg.ErrParseUUIDFailed("province", err))
		return fctx.ErrResponse(msg.PARAM_INVALID)
	}

	// Call the service to get the wards for the specified district
	province, err := h.service.GetProvinceByID(provinceID)
	if err != nil {
		return fctx.ErrResponse(msg.BAD_REQUEST)
	}

	response := utility.MapProvinceEntityToResponse(province)
	// Return the list of wards as a JSON response
	return fctx.JsonResponse(fiber.StatusOK, msg.CODE_SUCCESS, response)
}
