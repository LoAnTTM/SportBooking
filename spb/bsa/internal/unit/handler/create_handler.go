package handler

import (
	"spb/bsa/internal/unit/model"
	"spb/bsa/internal/unit/utility"
	"spb/bsa/pkg/global"
	"spb/bsa/pkg/logger"
	"spb/bsa/pkg/utils"

	"github.com/gofiber/fiber/v3"
)

var ErrCreateUnitFailed = fiber.NewError(fiber.StatusBadRequest, "create unit failed")

// Create godoc
//
// @summary 		Create unit
// @description 	Create unit
// @tags 			units
// @accept  		json
// @produce 		json
// @param 			Group body model.CreateUnitRequest true "Create unit"
// @success 		200 {object} utils.JSONResult{data=model.UnitResponse}		"Create unit success"
// @failure 		400 {object} utils.ErrorResult{message=string}        		"Create unit failed"
// @router 			/api/v1/units [post]
func (s *Handler) Create(ctx fiber.Ctx) error {
	var err error
	reqBody := new(model.CreateUnitRequest)

	fctx := utils.FiberCtx{Fctx: ctx}
	if err = fctx.ParseJsonToStruct(reqBody, global.SPB_VALIDATOR); err != nil {
		logger.Errorf("error parse json to struct: %v", err)
		return fctx.ErrResponse(ErrCreateUnitFailed)
	}
	unitCreated, err := s.service.Create(reqBody)
	if err != nil {
		logger.Errorf("error create unit: %v", err)
		return fctx.ErrResponse(ErrCreateUnitFailed)
	}
	unitResponse := utility.MapUnitEntityToResponse(unitCreated)

	return fctx.JsonResponse(fiber.StatusOK, unitResponse)
}
