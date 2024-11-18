package handler

import (
	"spb/bsa/internal/unit/model"
	"spb/bsa/internal/unit/utility"
	"spb/bsa/pkg/global"
	"spb/bsa/pkg/logger"
	"spb/bsa/pkg/msg"
	"spb/bsa/pkg/utils"

	"github.com/gofiber/fiber/v3"
)

// Create godoc
//
// @summary 		Create unit api
// @description 	Create unit api
// @tags 			units
// @accept  		json
// @produce 		json
// @param 			Group body model.CreateUnitRequest true 				"Create unit"
// @success 		200 {object} utils.JSONResult{data=model.UnitResponse}	"Create unit success"
// @failure 		400 {object} utils.JSONResult{}        					"Create unit failed"
// @router 			/api/v1/units [post]
func (s *Handler) Create(ctx fiber.Ctx) error {
	reqBody := new(model.CreateUnitRequest)
	fctx := utils.FiberCtx{Fctx: ctx}

	if err := fctx.ParseJsonToStruct(reqBody, global.SPB_VALIDATOR); err != nil {
		logger.Errorf("error parse json to struct: %v", err)
		return fctx.ErrResponse(msg.UNIT_INCORRECT)
	}

	unitCreated, err := s.service.Create(reqBody)
	if err != nil {
		logger.Errorf("error create unit: %v", err)
		return fctx.ErrResponse(msg.UNIT_INCORRECT)
	}

	unitResponse := utility.MapUnitEntityToResponse(unitCreated)
	return fctx.JsonResponse(fiber.StatusOK, msg.CODE_CREATE_UNIT_SUCCESS, unitResponse)
}
