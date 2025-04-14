package handler

import (
	"spb/bsa/api/sport_type/model"
	"spb/bsa/pkg/global"
	"spb/bsa/pkg/logger"
	"spb/bsa/pkg/msg"
	"spb/bsa/pkg/utils"

	"github.com/gofiber/fiber/v3"
)

// Update godoc
//
// @summary 		Update sport type api
// @description 	Update sport type api
// @tags 			sport types
// @accept  		json
// @produce 		json
// @param 			id path string true "Sport type ID"
// @param 			Group body model.UpdateSportTypeRequest true "Update sport type"
// @success 		200 {object} utils.JSONResult{data=model.SportTypeResponse}	"Update sport type success"
// @failure 		400 {object} utils.JSONResult{}        						"Update sport type failed"
// @router 			/api/v1/sport_types/{id} [put]
func (h *Handler) Update(ctx fiber.Ctx) error {
	var err error
	var sportTypeId string
	reqBody := new(model.UpdateSportTypeRequest)

	fctx := utils.FiberCtx{Fctx: ctx}
	if sportTypeId, err = fctx.ParseUUID("id"); err != nil {
		logger.Errorf(msg.ErrParseUUIDFailed("sport type", err))
		return fctx.ErrResponse(msg.PARAM_INVALID)
	}

	if err = fctx.ParseJsonToStruct(reqBody, global.SPB_VALIDATOR); err != nil {
		logger.Errorf(msg.ErrParseStructFailed("UpdateSportTypeRequest", err))
		return fctx.ErrResponse(msg.REQUEST_BODY_INVALID)
	}

	if err = h.service.Update(reqBody, sportTypeId); err != nil {
		return fctx.ErrResponse(msg.BAD_REQUEST)
	}

	return fctx.JsonResponse(fiber.StatusOK, msg.CODE_SUCCESS)
}
