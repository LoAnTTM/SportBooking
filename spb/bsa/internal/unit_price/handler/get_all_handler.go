package handler

import (
	"spb/bsa/internal/unit_price/model"
	"spb/bsa/internal/unit_price/utility"
	"spb/bsa/pkg/logger"
	"spb/bsa/pkg/utils"

	"github.com/gofiber/fiber/v3"
)

var ErrGetUnitPricesFailed = fiber.NewError(fiber.StatusNotFound, "get unit_prices failed")

// GetAll godoc
//
// @summary 		Get all unit_prices
// @description 	Get all unit_prices
// @tags 			unit-prices
// @accept  		json
// @produce 		json
// @param 			i query int false "Number items on page"
// @param 			p query int false "Page number"
// @param			b query string false "Order by"
// @param			t query string false "Order type"
// @success 		200 {object} utils.JSONResult{data=model.UnitPricesResponse}	"Get all unit_prices success"
// @failure 		404 {object} utils.ErrorResult{message=string}        	     	"Get all unit_prices failed"
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
		return fctx.ErrResponse(ErrGetUnitPricesFailed)
	}

	unitPriceResponse := utility.MapUnitPricesEntityToResponse(unit_prices, reqBody)
	return fctx.JsonResponse(fiber.StatusOK, unitPriceResponse)
}
