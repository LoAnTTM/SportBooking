package handler

import (
	"spb/bsa/pkg/logger"
	"spb/bsa/pkg/utils"

	"github.com/gofiber/fiber/v3"
)

var ErrDeleteUnitPriceFailed = fiber.NewError(fiber.StatusBadRequest, "delete unitPrice failed")

// Delete godoc
//
// @summary 		Delete unitPrice
// @description 	Delete unitPrice
// @tags 			unit-prices
// @accept  		json
// @produce 		json
// @param 			id path string true "unitPrice id"
// @success 		200 {object} utils.JSONResult{message=string}		"Delete unitPrice success"
// @failure 		400 {object} utils.ErrorResult{message=string}      "Delete unitPrice failed"
// @router 			/api/v1/unit-prices/{id} [delete]
func (s *Handler) Delete(ctx fiber.Ctx) error {
	var err error
	var unitPriceId string

	fctx := utils.FiberCtx{Fctx: ctx}
	if unitPriceId, err = fctx.ParseUUID("id"); err != nil {
		logger.Errorf("error parse unitPrice id: %v", err)
		return fctx.ErrResponse(ErrDeleteUnitPriceFailed)
	}

	err = s.service.Delete(unitPriceId)
	if err != nil {
		logger.Errorf("error delete unitPrice: %v", err)
		return fctx.ErrResponse(ErrDeleteUnitPriceFailed)
	}
	return fctx.JsonResponse(fiber.StatusOK, "delete unitPrice success")
}
