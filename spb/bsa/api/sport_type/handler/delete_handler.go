package handler

import (
	"spb/bsa/pkg/logger"
	"spb/bsa/pkg/msg"
	"spb/bsa/pkg/utils"

	"github.com/gofiber/fiber/v3"
)

// Create godoc
//
// @summary 		Delete sport type api
// @description 	Delete sport type api
// @tags 			sport types
// @param 			id path string true "Sport type ID"
// @success 		200 {object} utils.JSONResult{data=string}	"Delete sport type success"
// @failure 		400 {object} utils.JSONResult{}        		"Delete sport type failed"
// @router 			/api/v1/sport_types/{id} [delete]
func (h *Handler) Delete(ctx fiber.Ctx) error {
	var sportTypeId string
	var err error

	fctx := utils.FiberCtx{Fctx: ctx}
	if sportTypeId, err = fctx.ParseUUID("id"); err != nil {
		logger.Errorf(msg.ErrParseUUIDFailed("sport type", err))
		return fctx.ErrResponse(msg.PARAM_INVALID)
	}

	if err = h.service.Delete(sportTypeId); err != nil {
		logger.Errorf(msg.ErrDeleteFailed("sport type", err))
		return fctx.ErrResponse(msg.BAD_REQUEST)
	}

	return fctx.JsonResponse(fiber.StatusOK, msg.CODE_SUCCESS)
}
