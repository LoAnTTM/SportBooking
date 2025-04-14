package handler

import (
	"spb/bsa/api/media/model"
	"spb/bsa/pkg/global"
	"spb/bsa/pkg/logger"
	"spb/bsa/pkg/msg"
	"spb/bsa/pkg/utils"

	"github.com/gofiber/fiber/v3"
)

// AddMedia godoc
//
// @summary 		Add media to unit
// @description 	Add media to unit
// @tags 			units
// @accept  		json
// @produce 		json
// @param 			id path string true "Unit ID"
// @param 			media body model.CreateMediaRequest true "Media data"
// @success 		200 {object} utils.JSONResult{} "Add media to unit success"
// @failure 		400 {object} utils.JSONResult{} "Add media to unit failed"
// @router 			/api/v1/units/{id}/media [post]
func (h *Handler) AddMedia(ctx fiber.Ctx) error {
	var unitId string
	var err error
	reqBody := new(model.CreateMediaRequest)
	fctx := utils.FiberCtx{Fctx: ctx}

	if unitId, err = fctx.ParseUUID("id"); err != nil {
		logger.Errorf(msg.ErrParseUUIDFailed("unit", err))
		return fctx.ErrResponse(msg.PARAM_INVALID)
	}

	if err = fctx.ParseJsonToStruct(reqBody, global.SPB_VALIDATOR); err != nil {
		logger.Errorf(msg.ErrParseStructFailed("CreateMediaRequest", err))
		return fctx.ErrResponse(msg.REQUEST_BODY_INVALID)
	}

	if err = h.service.AddMedia(unitId, reqBody); err != nil {
		logger.Errorf(msg.ErrAddPropertyFailed("unit", "media", err))
		return fctx.ErrResponse(msg.BAD_REQUEST)
	}

	return fctx.JsonResponse(fiber.StatusOK, msg.CODE_SUCCESS)
}
