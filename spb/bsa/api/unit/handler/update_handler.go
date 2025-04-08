package handler

import (
	"spb/bsa/api/unit/model"
	"spb/bsa/api/unit/utility"
	unitPriceUtil "spb/bsa/api/unit_price/utility"
	"spb/bsa/pkg/global"
	"spb/bsa/pkg/logger"
	"spb/bsa/pkg/msg"
	"spb/bsa/pkg/utils"

	"github.com/gofiber/fiber/v3"
)

// Update godoc
//
// @summary 		Update unit by id
// @description 	Update unit by id
// @tags 			units
// @accept  		json
// @produce 		json
// @param 			unit body model.UpdateUnitRequest true 					"Unit data"
// @success 		200 {object} utils.JSONResult{data=model.UnitResponse}	"Update unit by id success"
// @failure 		400 {object} utils.JSONResult{}      					"Update unit by id failed"
// @router 			/api/v1/units/{id} [put]
func (s *Handler) Update(ctx fiber.Ctx) error {
	var err error
	var unitId string

	reqBody := new(model.UpdateUnitRequest)
	fctx := utils.FiberCtx{Fctx: ctx}

	if err = fctx.ParseJsonToStruct(reqBody, global.SPB_VALIDATOR); err != nil {
		logger.Errorf("error parse json to struct: %v", err)
		return fctx.ErrResponse(msg.UPDATE_UNIT_FAILED)
	}

	if unitId, err = fctx.ParseUUID("id"); err != nil {
		logger.Errorf("error parse unit id: %v", err)
		return fctx.ErrResponse(msg.UPDATE_UNIT_FAILED)
	}

	// validate unit price time
	unitPriceJSON := unitPriceUtil.MapUpdateRequestToJSON(reqBody.UnitPrices)
	if len(reqBody.UnitPrices) > 0 {
		if err = utility.ValidateUnitPriceTime(unitPriceJSON, reqBody.OpenTime, reqBody.CloseTime); err != nil {
			logger.Errorf("error validate unit price time: %v", err)
			return fctx.ErrResponse(msg.BAD_REQUEST)
		}
	}

	if err = s.service.Update(reqBody, unitId); err != nil {
		logger.Errorf("error update unit: %v", err)
		return fctx.ErrResponse(msg.UPDATE_UNIT_FAILED)
	}

	return fctx.JsonResponse(fiber.StatusOK, msg.CODE_UPDATE_UNIT_SUCCESS)
}
