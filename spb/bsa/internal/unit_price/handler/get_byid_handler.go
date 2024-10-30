package handler

import (
	"spb/bsa/internal/unit_price/utility"
	"spb/bsa/pkg/logger"
	"spb/bsa/pkg/utils"

	tb "spb/bsa/pkg/entities"

	"github.com/gofiber/fiber/v3"
)

var (
	ErrGetUnitPriceFailed = fiber.NewError(fiber.StatusBadRequest, "error get unitPrice")
	ErrUnitPriceNotFound  = fiber.NewError(fiber.StatusNotFound, "unitPrice not found")
)

// GetByID godoc
//
// @summary 		Get unitPrice by id
// @description 	Get unitPrice by id
// @tags 			unit-prices
// @accept  		json
// @produce 		json
// @param 			id path string true "UnitPrice ID"
// @success 		200 {object} utils.JSONResult{message=string}		"Get unitPrice by id success"
// @failure 		400 {object} utils.ErrorResult{message=string}      "Get unitPrice by id failed"
// @router 			/api/v1/unit-prices/{id} [delete]
func (s *Handler) GetByID(ctx fiber.Ctx) error {
	var err error
	var unitPriceId string
	var unitPrice *tb.UnitPrice

	fctx := utils.FiberCtx{Fctx: ctx}
	if unitPriceId, err = fctx.ParseUUID("id"); err != nil {
		logger.Errorf("error parse unitPrice id: %v", err)
		return fctx.ErrResponse(ErrGetUnitPriceFailed)
	}

	if unitPrice, err = s.service.GetByID(unitPriceId); err != nil {
		logger.Errorf("error get unitPrice by id: %v", err)
		return fctx.ErrResponse(ErrUnitPriceNotFound)
	}

	unitPriceResponse := utility.MapUnitPriceEntityToResponse(unitPrice)
	return fctx.JsonResponse(fiber.StatusOK, unitPriceResponse)
}
