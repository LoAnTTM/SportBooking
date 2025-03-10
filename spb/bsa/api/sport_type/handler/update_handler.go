package handler

import (
	"spb/bsa/api/sport_type/model"
	"spb/bsa/api/sport_type/utility"
	"spb/bsa/pkg/global"
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
		return fctx.ErrResponse(msg.UPDATE_SPORT_TYPE_FAILED)
	}

	if err = fctx.ParseJsonToStruct(reqBody, global.SPB_VALIDATOR); err != nil {
		return fctx.ErrResponse(msg.UPDATE_SPORT_TYPE_FAILED)
	}

	sportType, err := h.service.Update(reqBody, sportTypeId)
	if err != nil {
		return fctx.ErrResponse(msg.UPDATE_SPORT_TYPE_FAILED)
	}

	response := utility.MapSportTypeEntityToResponse(sportType)
	return fctx.JsonResponse(fiber.StatusOK, msg.CODE_UPDATE_SPORT_TYPE_SUCCESS, response)
}
