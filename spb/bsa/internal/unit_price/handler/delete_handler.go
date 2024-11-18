package handler

import (
	"spb/bsa/pkg/logger"
	"spb/bsa/pkg/msg"
	"spb/bsa/pkg/utils"

	"github.com/gofiber/fiber/v3"
)

// Delete godoc
//
// @summary 		Delete unit price
// @description 	Delete unit price
// @tags 			unit-prices
// @accept  		json
// @produce 		json
// @param 			id path string true 			"unit price id"
// @success 		200 {object} utils.JSONResult{}	"Delete unit price success"
// @failure 		400 {object} utils.JSONResult{} "Delete unit price failed"
// @router 			/api/v1/unit-prices/{id} [delete]
func (s *Handler) Delete(ctx fiber.Ctx) error {
	var err error
	var unitPriceId string

	fctx := utils.FiberCtx{Fctx: ctx}
	if unitPriceId, err = fctx.ParseUUID("id"); err != nil {
		logger.Errorf("error parse unitPrice id: %v", err)
		return fctx.ErrResponse(msg.DELETE_UNITPRICE_FAILED)
	}

	err = s.service.Delete(unitPriceId)
	if err != nil {
		logger.Errorf("error delete unitPrice: %v", err)
		return fctx.ErrResponse(msg.DELETE_UNITPRICE_FAILED)
	}

	return fctx.JsonResponse(fiber.StatusOK, msg.CODE_DELETE_UNIT_PRICE_SUCCESS)
}
