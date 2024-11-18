package handler

import (
	"spb/bsa/internal/unit_price/model"
	"spb/bsa/internal/unit_price/utility"
	"spb/bsa/pkg/global"
	"spb/bsa/pkg/logger"
	"spb/bsa/pkg/msg"
	"spb/bsa/pkg/utils"

	"github.com/gofiber/fiber/v3"
)

// Update godoc
//
// @summary 		Update unit price by id
// @description 	Update unit price by id
// @tags 			unit-prices
// @accept  		json
// @produce 		json
// @param 			unitPrice body model.UpdateUnitPriceRequest true 			"Unit price data"
// @success 		200 {object} utils.JSONResult{data=model.UnitPriceResponse}	"Update unit price by id success"
// @failure 		400 {object} utils.JSONResult{}								"Update unit price by id failed"
// @router 			/api/v1/unit-prices/{id} [put]
func (s *Handler) Update(ctx fiber.Ctx) error {
	var err error
	var unitPriceId string
	reqBody := new(model.UpdateUnitPriceRequest)

	fctx := utils.FiberCtx{Fctx: ctx}
	if err = fctx.ParseJsonToStruct(reqBody, global.SPB_VALIDATOR); err != nil {
		logger.Errorf("error parse json to struct: %v", err)
		return fctx.ErrResponse(msg.UPDATE_UNITPRICE_FAILED)
	}

	if unitPriceId, err = fctx.ParseUUID("id"); err != nil {
		logger.Errorf("error parse unitPrice id: %v", err)
		return fctx.ErrResponse(msg.UPDATE_UNITPRICE_FAILED)
	}

	unitPriceUpdated, err := s.service.Update(reqBody, unitPriceId)
	if err != nil {
		logger.Errorf("error create unitPrice: %v", err)
		return fctx.ErrResponse(msg.UPDATE_UNITPRICE_FAILED)
	}

	unitPriceResponse := utility.MapUnitPriceEntityToResponse(unitPriceUpdated)
	return fctx.JsonResponse(fiber.StatusOK, msg.CODE_UPDATE_UNITPRICE_SUCCESS, unitPriceResponse)
}
