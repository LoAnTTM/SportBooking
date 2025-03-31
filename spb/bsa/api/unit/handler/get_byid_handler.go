package handler

import (
	"spb/bsa/api/unit/utility"
	tb "spb/bsa/pkg/entities"
	"spb/bsa/pkg/logger"
	"spb/bsa/pkg/msg"
	"spb/bsa/pkg/utils"

	"github.com/gofiber/fiber/v3"
)

// GetByID godoc
//
// @summary 		Get unit by id
// @description 	Get unit by id
// @tags 			units
// @accept  		json
// @produce 		json
// @param 			id path string true 			"Unit ID"
// @success 		200 {object} utils.JSONResult{} "Get unit by id success"
// @failure 		400 {object} utils.JSONResult{} "Get unit by id failed"
// @router 			/api/v1/units/{id} [get]
func (s *Handler) GetByID(ctx fiber.Ctx) error {
	var err error
	var unitId string
	var unit *tb.Unit

	fctx := utils.FiberCtx{Fctx: ctx}
	if unitId, err = fctx.ParseUUID("id"); err != nil {
		logger.Errorf("error parse unit id: %v", err)
		return fctx.ErrResponse(msg.GET_UNIT_FAILED)
	}

	if unit, err = s.service.GetByID(unitId); err != nil {
		logger.Errorf("error get unit by id: %v", err)
		return fctx.ErrResponse(msg.UNIT_NOTFOUND)
	}

	unitResponse := utility.MapUnitEntityToResponse(unit)
	return fctx.JsonResponse(fiber.StatusOK, msg.CODE_GET_UNIT_SUCCESS, unitResponse)
}
