package handler

import (
	"spb/bsa/internal/unit_price/model"
	"spb/bsa/internal/unit_price/utility"
	"spb/bsa/pkg/global"
	"spb/bsa/pkg/logger"
	"spb/bsa/pkg/utils"

	"github.com/gofiber/fiber/v3"
)

var ErrUpdateUnitPriceFailed = fiber.NewError(fiber.StatusBadRequest, "update unitPrice failed")

// Update godoc
//
// @summary 		Update unitPrice by id
// @description 	Update unitPrice by id
// @tags 			unit-prices
// @accept  		json
// @produce 		json
// @param 			unitPrice body model.UpdateUnitPriceRequest true "UnitPrice data"
// @success 		200 {object} utils.JSONResult{data=model.UnitPriceResponse}		"Update unitPrice by id success"
// @failure 		400 {object} utils.ErrorResult{message=string}      "Update unitPrice by id failed"
// @router 			/api/v1/unit-prices/{id} [patch]
func (s *Handler) Update(ctx fiber.Ctx) error {
	var err error
	var unitPriceId string
	reqBody := new(model.UpdateUnitPriceRequest)

	fctx := utils.FiberCtx{Fctx: ctx}
	if err = fctx.ParseJsonToStruct(reqBody, global.SPB_VALIDATOR); err != nil {
		logger.Errorf("error parse json to struct: %v", err)
		return fctx.ErrResponse(ErrUpdateUnitPriceFailed)
	}
	if unitPriceId, err = fctx.ParseUUID("id"); err != nil {
		logger.Errorf("error parse unitPrice id: %v", err)
		return fctx.ErrResponse(ErrUpdateUnitPriceFailed)
	}

	unitPriceUpdated, err := s.service.Update(reqBody, unitPriceId)
	if err != nil {
		logger.Errorf("error create unitPrice: %v", err)
		return fctx.ErrResponse(ErrUpdateUnitPriceFailed)
	}
	unitPriceResponse := utility.MapUnitPriceEntityToResponse(unitPriceUpdated)

	return fctx.JsonResponse(fiber.StatusOK, unitPriceResponse)
}
