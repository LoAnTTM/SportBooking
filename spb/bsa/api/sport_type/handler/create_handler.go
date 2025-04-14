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
		logger.Errorf(msg.ErrParseStructFailed("CreateSportType", err))
		return fctx.ErrResponse(msg.REQUEST_BODY_INVALID)
	}

	sportTypeCreated, err := h.service.Create(reqBody)
	if err != nil {
		logger.Errorf(msg.ErrCreateFailed("sport type", err))
		return fctx.ErrResponse(msg.BAD_REQUEST)
	}

	response := utility.MapSportTypeEntityToResponse(sportTypeCreated)
	return fctx.JsonResponse(fiber.StatusOK, msg.CODE_SUCCESS, response)
}
