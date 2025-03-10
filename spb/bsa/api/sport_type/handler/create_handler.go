package handler

import (
	"spb/bsa/api/sport_type/model"
	"spb/bsa/api/sport_type/utility"
	"spb/bsa/pkg/global"
	"spb/bsa/pkg/logger"
	"spb/bsa/pkg/msg"
	"spb/bsa/pkg/utils"

	"github.com/gofiber/fiber/v3"
)

// Create godoc
//
// @summary 		Create sport type api
// @description 	Create sport type api
// @tags 			sport types
// @accept  		json
// @produce 		json
// @param 			Group body model.CreateSportTypeRequest true 				"Create sport type"
// @success 		200 {object} utils.JSONResult{data=model.SportTypeResponse}	"Create sport type success"
// @failure 		400 {object} utils.JSONResult{}        						"Create sport type failed"
// @router 			/api/v1/sport_types [post]
func (h *Handler) Create(ctx fiber.Ctx) error {
	reqBody := new(model.CreateSportTypeRequest)
	fctx := utils.FiberCtx{Fctx: ctx}

	if err := fctx.ParseJsonToStruct(reqBody, global.SPB_VALIDATOR); err != nil {
		logger.Errorf("error parse json to struct: %v", err)
		return fctx.ErrResponse(msg.CREATE_SPORT_TYPE_FAILED)
	}

	sportTypeCreated, err := h.service.Create(reqBody)
	if err != nil {
		logger.Errorf("error create sport type: %v", err)
		return fctx.ErrResponse(msg.CREATE_SPORT_TYPE_FAILED)
	}

	sportTypeResponse := utility.MapSportTypeEntityToResponse(sportTypeCreated)
	return fctx.JsonResponse(fiber.StatusOK, msg.CODE_CREATE_SPORT_TYPE_SUCCESS, sportTypeResponse)
}
