package handler

import (
	"spb/bsa/internal/unit_service/model"
	"spb/bsa/internal/unit_service/utility"
	"spb/bsa/pkg/logger"
	"spb/bsa/pkg/utils"

	"github.com/gofiber/fiber/v3"
)

var ErrGetUnitServicesFailed = fiber.NewError(fiber.StatusNotFound, "get unit_services failed")

// GetAll godoc
//
// @summary 		Get all unit_services
// @description 	Get all unit_services
// @tags 			unit-services
// @accept  		json
// @produce 		json
// @param 			i query int false "Number items on page"
// @param 			p query int false "Page number"
// @param			b query string false "Order by"
// @param			t query string false "Order type"
// @success 		200 {object} utils.JSONResult{data=model.UnitServicesResponse}	"Get all unit_services success"
// @failure 		404 {object} utils.ErrorResult{message=string}        	     	"Get all unit_services failed"
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
		return fctx.ErrResponse(ErrGetUnitServicesFailed)
	}

	unitServiceResponse := utility.MapUnitServiceEntitiesToResponse(unitServices, reqBody)
	return fctx.JsonResponse(fiber.StatusOK, unitServiceResponse)
}
