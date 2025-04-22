package handler

import (
	authModel "spb/bsa/api/auth/model"
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

	if unitId, err = fctx.ParseUUID("id"); err != nil {
		logger.Errorf(msg.ErrParseUUIDFailed("unit", err))
		return fctx.ErrResponse(msg.PARAM_INVALID)
	}

	if err = fctx.ParseJsonToStruct(reqBody, global.SPB_VALIDATOR); err != nil {
		logger.Errorf(msg.ErrParseStructFailed("UpdateUnitRequest", err))
		return fctx.ErrResponse(msg.REQUEST_BODY_INVALID)
	}

	// validate unit price time
	unitPriceJSON := unitPriceUtil.MapUpdateRequestToJSON(reqBody.UnitPrices)
	if len(reqBody.UnitPrices) > 0 {
		if err = utility.ValidateUnitPriceTime(unitPriceJSON, reqBody.OpenTime, reqBody.CloseTime); err != nil {
			logger.Errorf(msg.ErrInvalid("unit price time", err))
			return fctx.ErrResponse(msg.BAD_REQUEST)
		}
	}

	claims := ctx.Locals("claims").(authModel.UserClaims)
	userId := claims.UserID

	if err = s.service.Update(reqBody, unitId, userId); err != nil {
		logger.Errorf(msg.ErrUpdateFailed("unit", err))
		switch err {
		case msg.ErrUnitNotFound:
			return fctx.ErrResponse(msg.UNIT_NOT_FOUND)
		case msg.ErrUnitWrongOwner:
			return fctx.ErrResponse(msg.UNIT_WRONG_OWNER)
		default:
			return fctx.ErrResponse(msg.BAD_REQUEST)
		}
	}

	return fctx.JsonResponse(fiber.StatusOK, msg.CODE_SUCCESS)
}
