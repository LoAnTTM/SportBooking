package handler

import (
	"spb/bsa/pkg/logger"
	"spb/bsa/pkg/msg"
	"spb/bsa/pkg/utils"

	"github.com/gofiber/fiber/v3"
)

// Delete godoc
//
// @summary			Delete club api
// @description		Delete club api
// @tags			clubs
// @accept			json
// @produce			json
// @param			id path string true 							"club id"
// @success			200 {object} utils.JSONResult{message=string}	"Delete club success"
// @failure			400 {object} utils.JSONResult{}      			"Delete club failed"
// @router			/api/v1/clubs/{id} [delete]
func (s *Handler) Delete(ctx fiber.Ctx) error {
	var err error
	var clubId string

	fctx := utils.FiberCtx{Fctx: ctx}
	if clubId, err = fctx.ParseUUID("id"); err != nil {
		logger.Errorf("error parse club id: %v", err)
		return fctx.ErrResponse(msg.DELETE_UNIT_FAILED)
	}

	err = s.service.Delete(clubId)
	if err != nil {
		logger.Errorf("error delete club: %v", err)
		return fctx.ErrResponse(msg.DELETE_UNIT_FAILED)
	}
	return fctx.JsonResponse(fiber.StatusOK, msg.CODE_DELETE_CLUB_SUCCESS)
}
