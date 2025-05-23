package handler

import (
	_ "spb/bsa/api/sport_type/model"
	"spb/bsa/api/sport_type/utility"
	"spb/bsa/pkg/msg"
	"spb/bsa/pkg/utils"

	"github.com/gofiber/fiber/v3"
)

// GetAll godoc
//
// @summary 		Get all sport type api
// @description 	Get all sport type api
// @tags 			sport types
// @accept  		json
// @produce 		json
// @success 		200 {object} utils.JSONResult{data=model.SportTypesResponse}	"Get all sport type success"
// @failure 		400 {object} utils.JSONResult{}        							"Get all sport type failed"
// @router 			/api/v1/sport_types [get]
func (h *Handler) GetAll(ctx fiber.Ctx) error {
	var err error
	fctx := utils.FiberCtx{Fctx: ctx}

	sportTypes, err := h.service.GetAll()
	if err != nil {
		return fctx.ErrResponse(msg.NOT_FOUND)
	}

	response := utility.MapSportTypeEntitiesToResponse(sportTypes)
	return fctx.JsonResponse(fiber.StatusOK, msg.CODE_SUCCESS, response)
}
