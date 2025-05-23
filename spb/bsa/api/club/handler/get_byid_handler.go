package handler

import (
	"spb/bsa/api/club/utility"
	tb "spb/bsa/pkg/entities"
	"spb/bsa/pkg/logger"
	"spb/bsa/pkg/msg"
	"spb/bsa/pkg/utils"

	"github.com/gofiber/fiber/v3"
)

// GetByID godoc
//
// @summary 		Get club by id
// @description 	Get club by id
// @tags 			clubs
// @accept  		json
// @produce 		json
// @param 			id path string true 			"Club ID"
// @success 		200 {object} utils.JSONResult{} "Get club by id success"
// @failure 		400 {object} utils.JSONResult{} "Get club by id failed"
// @router 			/api/v1/clubs/{id} [get]
func (s *Handler) GetByID(ctx fiber.Ctx) error {
	var err error
	var clubId string
	var club *tb.Club

	fctx := utils.FiberCtx{Fctx: ctx}
	if clubId, err = fctx.ParseUUID("id"); err != nil {
		logger.Errorf(msg.ErrParseUUIDFailed("club", err))
		return fctx.ErrResponse(msg.PARAM_INVALID)
	}

	if club, err = s.service.GetByID(clubId); err != nil {
		logger.Errorf(msg.ErrGetFailed("club", err))
		return fctx.ErrResponse(msg.BAD_REQUEST)
	}

	clubResponse := utility.MapEntityToResponse(club)
	return fctx.JsonResponse(fiber.StatusOK, msg.CODE_SUCCESS, clubResponse)
}
