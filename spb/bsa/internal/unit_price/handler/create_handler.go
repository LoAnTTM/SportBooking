package handler

import (
	"spb/bsa/internal/unit_price/model"
	"spb/bsa/internal/unit_price/utility"
	"spb/bsa/pkg/global"
	"spb/bsa/pkg/logger"
	"spb/bsa/pkg/utils"

	"github.com/gofiber/fiber/v3"
)

var ErrCreateUnitPriceFailed = fiber.NewError(fiber.StatusBadRequest, "create unitPrice failed")

// Create godoc
//
// @summary 		Create unitPrice
// @description 	Create unitPrice
// @tags 			unit-prices
// @accept  		json
// @produce 		json
// @param 			Group body model.CreateUnitPriceRequest true "Create unitPrice"
// @success 		200 {object} utils.JSONResult{data=model.UnitPriceResponse}		"Create unitPrice success"
// @failure 		400 {object} utils.ErrorResult{message=string}        		"Create unitPrice failed"
// @router 			/api/v1/unit-prices [post]
func (s *Handler) Create(ctx fiber.Ctx) error {
	var err error
	reqBody := new(model.CreateUnitPriceRequest)

	fctx := utils.FiberCtx{Fctx: ctx}
	if err = fctx.ParseJsonToStruct(reqBody, global.SPB_VALIDATOR); err != nil {
		logger.Errorf("error parse json to struct: %v", err)
		return fctx.ErrResponse(ErrCreateUnitPriceFailed)
	}
	unitPriceCreated, err := s.service.Create(reqBody)
	if err != nil {
		logger.Errorf("error create unitPrice: %v", err)
		return fctx.ErrResponse(ErrCreateUnitPriceFailed)
	}
	unitPriceResponse := utility.MapUnitPriceEntityToResponse(unitPriceCreated)

	return fctx.JsonResponse(fiber.StatusOK, unitPriceResponse)
}
