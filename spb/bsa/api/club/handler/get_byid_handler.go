package handler

import (
	"spb/bsa/api/club/utility"
	"spb/bsa/pkg/auth"
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
	claims, err := auth.GetTokenFromCookie(ctx)
	if err != nil {
		logger.Errorf("error parse jwt: %v", err)
		return fctx.ErrResponse(msg.GET_UNIT_FAILED)
	}

	if clubId, err = fctx.ParseUUID("id"); err != nil {
		logger.Errorf("error parse club id: %v", err)
		return fctx.ErrResponse(msg.GET_UNIT_FAILED)
	}

	role := claims.Role
	if club, err = s.service.GetByID(clubId, role); err != nil {
		logger.Errorf("error get club by id: %v", err)
		return fctx.ErrResponse(msg.UNIT_NOTFOUND)
	}

	clubResponse := utility.MapClubEntityToResponse(club)
	return fctx.JsonResponse(fiber.StatusOK, msg.CODE_GET_UNIT_SUCCESS, clubResponse)
}
