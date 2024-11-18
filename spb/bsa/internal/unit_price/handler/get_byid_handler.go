package handler

import (
	"spb/bsa/internal/unit_price/utility"
	"spb/bsa/pkg/logger"
	"spb/bsa/pkg/msg"
	"spb/bsa/pkg/utils"

	tb "spb/bsa/pkg/entities"

	"github.com/gofiber/fiber/v3"
)

// GetByID godoc
//
// @summary 		Get unit price by id
// @description 	Get unit price by id
// @tags 			unit-prices
// @accept  		json
// @produce 		json
// @param 			id path string true 			"Unit price ID"
// @success 		200 {object} utils.JSONResult{}	"Get unit price by id success"
// @failure 		400 {object} utils.JSONResult{} "Get unit price by id failed"
// @router 			/api/v1/unit-prices/{id} [get]
func (s *Handler) GetByID(ctx fiber.Ctx) error {
	var err error
	var unitPriceId string
	var unitPrice *tb.UnitPrice

	fctx := utils.FiberCtx{Fctx: ctx}
	if unitPriceId, err = fctx.ParseUUID("id"); err != nil {
		logger.Errorf("error parse unitPrice id: %v", err)
		return fctx.ErrResponse(msg.GET_UNITPRICE_FAILED)
	}

	if unitPrice, err = s.service.GetByID(unitPriceId); err != nil {
		logger.Errorf("error get unitPrice by id: %v", err)
		return fctx.ErrResponse(msg.UNITPRICE_NOTFOUND)
	}

	unitPriceResponse := utility.MapUnitPriceEntityToResponse(unitPrice)
	return fctx.JsonResponse(fiber.StatusOK, msg.CODE_GET_UNIT_PRICE_SUCCESS, unitPriceResponse)
}
