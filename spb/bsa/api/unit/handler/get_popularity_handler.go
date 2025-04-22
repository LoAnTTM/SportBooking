package handler

import (
	"spb/bsa/api/unit/model"
	"spb/bsa/api/unit/utility"
	"spb/bsa/pkg/global"
	"spb/bsa/pkg/logger"
	"spb/bsa/pkg/msg"
	"spb/bsa/pkg/utils"

	"github.com/gofiber/fiber/v3"
)

// GetPopularity godoc
//
// @summary 		Get unit popularity
// @description 	Get unit popularity
// @tags 			units
// @accept  		json
// @produce 		json
// @param 			Group body model.PopularityRequest true 					"Get popularity unit"
// @success 		200 {object} utils.JSONResult{data=[]model.UnitResponse}	"Get unit popularity success"
// @failure 		400 {object} utils.JSONResult{}      						"Get unit popularity failed"
// @router 			/api/v1/units/popularity [post]
func (h *Handler) GetPopularity(ctx fiber.Ctx) error {
	var err error
	reqBody := new(model.PopularityRequest)
	fctx := utils.FiberCtx{Fctx: ctx}

	if err = fctx.ParseJsonToStruct(reqBody, global.SPB_VALIDATOR); err != nil {
		logger.Errorf(msg.ErrGetFailed("PopularityRequest", err))
		return fctx.ErrResponse(msg.REQUEST_BODY_INVALID)
	}

	units, err := h.service.GetPopularity(reqBody)
	if err != nil {
		logger.Errorf(msg.ErrGetFailed("unit popularity", err))
		switch err {
		case msg.ErrUnitNotFound:
			return fctx.ErrResponse(msg.UNIT_NOT_FOUND)
		default:
			return fctx.ErrResponse(msg.NOT_FOUND)
		}
	}

	response := utility.MapUnitEntitiesToResponseWithoutPagination(units)
	return fctx.JsonResponse(fiber.StatusOK, msg.CODE_SUCCESS, response)
}
