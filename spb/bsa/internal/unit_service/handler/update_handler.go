package handler

import (
	"spb/bsa/internal/unit_service/model"
	"spb/bsa/internal/unit_service/utility"
	"spb/bsa/pkg/global"
	"spb/bsa/pkg/logger"
	"spb/bsa/pkg/msg"
	"spb/bsa/pkg/utils"

	"github.com/gofiber/fiber/v3"
)

// Update godoc
//
// @summary 		Update unit service by id
// @description 	Update unit service by id
// @tags 			unit-services
// @accept  		json
// @produce 		json
// @param 			unitService body model.UpdateUnitServiceRequest true 		  "Unit service data"
// @success 		200 {object} utils.JSONResult{data=model.UnitServiceResponse} "Update unit service by id success"
// @failure 		400 {object} utils.JSONResult{}     						  "Update unit service by id failed"
// @router 			/api/v1/unit-services/{id} [put]
func (s *Handler) Update(ctx fiber.Ctx) error {
	var err error
	var unitServiceId string
	reqBody := new(model.UpdateUnitServiceRequest)

	fctx := utils.FiberCtx{Fctx: ctx}
	if err = fctx.ParseJsonToStruct(reqBody, global.SPB_VALIDATOR); err != nil {
		logger.Errorf("error parse json to struct: %v", err)
		return fctx.ErrResponse(msg.UPDATE_UNIT_SERVICE_FAILED)
	}

	if unitServiceId, err = fctx.ParseUUID("id"); err != nil {
		logger.Errorf("error parse user id: %v", err)
		return fctx.ErrResponse(msg.UPDATE_UNIT_SERVICE_FAILED)
	}

	unit_serviceUpdated, err := s.service.Update(reqBody, unitServiceId)
	if err != nil {
		logger.Errorf("error create unit_service: %v", err)
		return fctx.ErrResponse(msg.UPDATE_UNIT_SERVICE_FAILED)
	}

	unit_serviceResponse := utility.MapUnitServiceEntityToResponse(unit_serviceUpdated)
	return fctx.JsonResponse(fiber.StatusOK, msg.CODE_UPDATE_UNITSERVICE_SUCCESS, unit_serviceResponse)
}
