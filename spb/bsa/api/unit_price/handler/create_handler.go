package handler

import (
	"spb/bsa/api/unit_price/model"
	"spb/bsa/api/unit_price/utility"
	"spb/bsa/pkg/global"
	"spb/bsa/pkg/logger"
	"spb/bsa/pkg/msg"
	"spb/bsa/pkg/utils"

	"github.com/gofiber/fiber/v3"
)

// Create godoc
//
// @summary 		Create unit price
// @description 	Create unit price
// @tags 			unit-prices
// @accept  		json
// @produce 		json
// @param 			Group body model.CreateUnitPriceRequest true 				"Create unit price"
// @success 		200 {object} utils.JSONResult{data=model.UnitPriceResponse}	"Create unit price success"
// @failure 		400 {object} utils.JSONResult{}        						"Create unit price failed"
// @router 			/api/v1/unit-prices [post]
func (s *Handler) Create(ctx fiber.Ctx) error {
	var err error
	reqBody := new(model.CreateUnitPriceRequest)

	fctx := utils.FiberCtx{Fctx: ctx}
	if err = fctx.ParseJsonToStruct(reqBody, global.SPB_VALIDATOR); err != nil {
		logger.Errorf("error parse json to struct: %v", err)
		return fctx.ErrResponse(msg.CREATE_UNITPRICE_FAILED)
	}

	unitPriceCreated, err := s.service.Create(reqBody)
	if err != nil {
		logger.Errorf("error create unitPrice: %v", err)
		return fctx.ErrResponse(msg.CREATE_UNITPRICE_FAILED)
	}

	unitPriceResponse := utility.MapUnitPriceEntityToResponse(unitPriceCreated)
	return fctx.JsonResponse(fiber.StatusOK, msg.CODE_CREATE_UNIT_PRICE_SUCCESS, unitPriceResponse)
}
