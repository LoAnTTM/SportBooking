package handler

import (
	"spb/bsa/internal/unit/model"
	"spb/bsa/internal/unit/utility"
	"spb/bsa/pkg/global"
	"spb/bsa/pkg/logger"
	"spb/bsa/pkg/utils"

	"github.com/gofiber/fiber/v3"
)

var ErrUpdateUnitFailed = fiber.NewError(fiber.StatusBadRequest, "update unit failed")

// Update godoc
//
// @summary 		Update unit by id
// @description 	Update unit by id
// @tags 			units
// @accept  		json
// @produce 		json
// @param 			unit body model.UpdateUnitRequest true "Unit data"
// @success 		200 {object} utils.JSONResult{data=model.UnitResponse}		"Update unit by id success"
// @failure 		400 {object} utils.ErrorResult{message=string}      "Update unit by id failed"
// @router 			/api/v1/units/{id} [patch]
func (s *Handler) Update(ctx fiber.Ctx) error {
	var err error
	var unitId string
	reqBody := new(model.UpdateUnitRequest)

	fctx := utils.FiberCtx{Fctx: ctx}
	if err = fctx.ParseJsonToStruct(reqBody, global.SPB_VALIDATOR); err != nil {
		logger.Errorf("error parse json to struct: %v", err)
		return fctx.ErrResponse(ErrUpdateUnitFailed)
	}
	if unitId, err = fctx.ParseUUID("id"); err != nil {
		logger.Errorf("error parse unit id: %v", err)
		return fctx.ErrResponse(ErrUpdateUnitFailed)
	}

	unitUpdated, err := s.service.Update(reqBody, unitId)
	if err != nil {
		logger.Errorf("error create unit: %v", err)
		return fctx.ErrResponse(ErrUpdateUnitFailed)
	}
	unitResponse := utility.MapUnitEntityToResponse(unitUpdated)

	return fctx.JsonResponse(fiber.StatusOK, unitResponse)
}
