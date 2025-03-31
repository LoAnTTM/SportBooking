package handler

import (
	_ "spb/bsa/api/sport_type/model"
	"spb/bsa/api/sport_type/utility"
	"spb/bsa/pkg/msg"
	"spb/bsa/pkg/utils"

	"github.com/gofiber/fiber/v3"
)

// GetById godoc
//
// @summary 		Get sport type by ID api
// @description 	Get sport type by ID api
// @tags 			sport types
// @param 			id path string true "Sport type ID"
// @success 		200 {object} utils.JSONResult{data=model.SportTypeResponse}	"Get sport type by ID success"
// @failure 		400 {object} utils.JSONResult{}        						"Get sport type by ID failed"
// @router 			/api/v1/sport_types/{id} [get]
func (h *Handler) GetByID(ctx fiber.Ctx) error {
	var err error
	var sportTypeId string
	fctx := utils.FiberCtx{Fctx: ctx}

	if sportTypeId, err = fctx.ParseUUID("id"); err != nil {
		return fctx.ErrResponse(msg.GET_SPORT_TYPE_FAILED)
	}

	sportType, err := h.service.GetByID(sportTypeId)
	if err != nil {
		return fctx.ErrResponse(msg.GET_ALL_SPORT_TYPE_FAILED)
	}

	response := utility.MapSportTypeEntityToResponse(sportType)
	return fctx.JsonResponse(fiber.StatusOK, msg.CODE_GET_SPORT_TYPE_SUCCESS, response)
}
