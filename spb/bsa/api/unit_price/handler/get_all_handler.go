package handler

import (
	"spb/bsa/api/unit_price/model"
	"spb/bsa/api/unit_price/utility"
	"spb/bsa/pkg/logger"
	"spb/bsa/pkg/msg"
	"spb/bsa/pkg/utils"

	"github.com/gofiber/fiber/v3"
)

// GetAll godoc
//
// @summary 		Get all unit price
// @description 	Get all unit price
// @tags 			unit-prices
// @accept  		json
// @produce 		json
// @param 			i query int false 											 "Number items on page"
// @param 			p query int false 											 "Page number"
// @param			b query string false 										 "Order by"
// @param			t query string false 										 "Order type"
// @success 		200 {object} utils.JSONResult{data=model.UnitPricesResponse} "Get all unit price success"
// @failure 		404 {object} utils.JSONResult{}        	     				 "Get all unit price failed"
// @router 			/api/v1/unit-prices [get]
func (s *Handler) GetAll(ctx fiber.Ctx) error {
	var err error
	reqBody := new(model.GetUnitPricesRequest)
	fctx := utils.FiberCtx{Fctx: ctx}

	pagination := utils.GetPagination(ctx.Queries())
	reqBody.Pagination = pagination

	unit_prices, err := s.service.GetAll(reqBody)
	if err != nil {
		logger.Errorf("error get unit_prices: %v", err)
		return fctx.ErrResponse(msg.GET_UNITPRICE_FAILED)
	}

	unitPriceResponse := utility.MapUnitPricesEntityToResponse(unit_prices, reqBody)
	return fctx.JsonResponse(fiber.StatusOK, msg.CODE_GET_UNIT_PRICE_SUCCESS, unitPriceResponse)
}
