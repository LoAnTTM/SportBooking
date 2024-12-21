package handler

import (
	"spb/bsa/api/unit_service/model"
	"spb/bsa/api/unit_service/utility"
	"spb/bsa/pkg/global"
	"spb/bsa/pkg/logger"
	"spb/bsa/pkg/msg"
	"spb/bsa/pkg/utils"

	"github.com/gofiber/fiber/v3"
)

// Create godoc
//
// @summary 		Create unit service
// @description 	Create unit service
// @tags 			unit-services
// @accept  		json
// @produce 		json
// @param 			Group body model.CreateUnitServiceRequest true 				  "Create unit service"
// @success 		200 {object} utils.JSONResult{data=model.UnitServiceResponse} "Create unit service success"
// @failure 		400 {object} utils.JSONResult{}        		 				  "Create unit service failed"
// @router 			/api/v1/unit-services [post]
func (s *Handler) Create(ctx fiber.Ctx) error {
	var err error
	reqBody := new(model.CreateUnitServiceRequest)

	fctx := utils.FiberCtx{Fctx: ctx}
	if err = fctx.ParseJsonToStruct(reqBody, global.SPB_VALIDATOR); err != nil {
		logger.Errorf("error parse json to struct: %v", err)
		return fctx.ErrResponse(msg.CREATE_UNIT_SERVICE_FAILED)
	}

	unitServiceCreated, err := s.service.Create(reqBody)
	if err != nil {
		logger.Errorf("error create unit_service: %v", err)
		return fctx.ErrResponse(msg.CREATE_UNIT_SERVICE_FAILED)
	}

	unitServiceResponse := utility.MapUnitServiceEntityToResponse(unitServiceCreated)
	return fctx.JsonResponse(fiber.StatusOK, msg.CODE_CREATE_UNITSERVICE_SUCCESS, unitServiceResponse)
}
