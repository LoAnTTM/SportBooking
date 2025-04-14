package handler

import (
	"spb/bsa/pkg/logger"
	"spb/bsa/pkg/msg"
	"spb/bsa/pkg/utils"

	"github.com/gofiber/fiber/v3"
)

// Delete godoc
//
// @summary			Delete unit api
// @description		Delete unit api
// @tags			units
// @accept			json
// @produce			json
// @param			id path string true 							"unit id"
// @success			200 {object} utils.JSONResult{message=string}	"Delete unit success"
// @failure			400 {object} utils.JSONResult{}      			"Delete unit failed"
// @router			/api/v1/units/{id} [delete]
func (s *Handler) Delete(ctx fiber.Ctx) error {
	var err error
	var unitId string

	fctx := utils.FiberCtx{Fctx: ctx}
	if unitId, err = fctx.ParseUUID("id"); err != nil {
		logger.Errorf(msg.ErrParseUUIDFailed("unit", err))
		return fctx.ErrResponse(msg.PARAM_INVALID)
	}

	if err = s.service.Delete(unitId); err != nil {
		logger.Errorf(msg.ErrDeleteFailed("unit", err))
		return fctx.ErrResponse(msg.BAD_REQUEST)
	}
	return fctx.JsonResponse(fiber.StatusOK, msg.CODE_SUCCESS)
}
