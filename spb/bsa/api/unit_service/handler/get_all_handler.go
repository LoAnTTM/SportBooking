package handler

import (
	"spb/bsa/api/unit_service/model"
	"spb/bsa/api/unit_service/utility"
	"spb/bsa/pkg/logger"
	"spb/bsa/pkg/msg"
	"spb/bsa/pkg/utils"

	"github.com/gofiber/fiber/v3"
)

// GetAll godoc
//
// @summary 		Get all unit service
// @description 	Get all unit service
// @tags 			unit-services
// @accept  		json
// @produce 		json
// @param 			i query int false 												"Number items on page"
// @param 			p query int false 												"Page number"
// @param			b query string false 											"Order by"
// @param			t query string false 											"Order type"
// @success 		200 {object} utils.JSONResult{data=model.UnitServicesResponse}	"Get all unit service success"
// @failure 		404 {object} utils.JSONResult{}        	     					"Get all unit service failed"
// @router 			/api/v1/unit-services [get]
func (s *Handler) GetAll(ctx fiber.Ctx) error {
	var err error
	reqBody := new(model.GetUnitServicesRequest)
	fctx := utils.FiberCtx{Fctx: ctx}

	pagination := utils.GetPagination(ctx.Queries())
	reqBody.Pagination = pagination

	unitServices, err := s.service.GetAll(reqBody)
	if err != nil {
		logger.Errorf("error get unit_services: %v", err)
		return fctx.ErrResponse(msg.GET_UNIT_SERVICE_FAILED)
	}

	unitServiceResponse := utility.MapUnitServiceEntitiesToResponse(unitServices, reqBody)
	return fctx.JsonResponse(fiber.StatusOK, msg.CODE_GET_UNITSERVICE_SUCCESS, unitServiceResponse)
}
