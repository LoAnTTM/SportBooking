package handler

import (
	"spb/bsa/internal/unit_service/model"
	"spb/bsa/internal/unit_service/utility"
	"spb/bsa/pkg/global"
	"spb/bsa/pkg/logger"
	"spb/bsa/pkg/utils"

	"github.com/gofiber/fiber/v3"
)

var ErrCreateUnitServiceFailed = fiber.NewError(fiber.StatusBadRequest, "create unit_service failed")

// Create godoc
//
// @summary 		Create unitPrice
// @description 	Create unitPrice
// @tags 			unit-prices
// @accept  		json
// @produce 		json
// @param 			Group body model.CreateUnitServiceRequest true "Create unitPrice"
// @success 		200 {object} utils.JSONResult{data=model.UnitServiceResponse}		"Create unitPrice success"
// @failure 		400 {object} utils.ErrorResult{message=string}        		 		"Create unitPrice failed"
// @router 			/api/v1/unit-prices [post]
func (s *Handler) Create(ctx fiber.Ctx) error {
	var err error
	reqBody := new(model.CreateUnitServiceRequest)

	fctx := utils.FiberCtx{Fctx: ctx}
	if err = fctx.ParseJsonToStruct(reqBody, global.SPB_VALIDATOR); err != nil {
		logger.Errorf("error parse json to struct: %v", err)
		return fctx.ErrResponse(ErrCreateUnitServiceFailed)
	}
	unitServiceCreated, err := s.service.Create(reqBody)
	if err != nil {
		logger.Errorf("error create unit_service: %v", err)
		return fctx.ErrResponse(ErrCreateUnitServiceFailed)
	}
	unitServiceResponse := utility.MapUnitServiceEntityToResponse(unitServiceCreated)

	return fctx.JsonResponse(fiber.StatusOK, unitServiceResponse)
}
