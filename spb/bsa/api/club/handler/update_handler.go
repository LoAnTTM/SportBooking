package handler

import (
	"spb/bsa/api/club/model"
	"spb/bsa/api/club/utility"
	"spb/bsa/pkg/global"
	"spb/bsa/pkg/logger"
	"spb/bsa/pkg/msg"
	"spb/bsa/pkg/utils"

	"github.com/gofiber/fiber/v3"
)

// Update godoc
//
// @summary 		Update club by id
// @description 	Update club by id
// @tags 			clubs
// @accept  		json
// @produce 		json
// @param 			club body model.UpdateClubRequest true 					"Club data"
// @success 		200 {object} utils.JSONResult{data=model.ClubResponse}	"Update club by id success"
// @failure 		400 {object} utils.JSONResult{}      					"Update club by id failed"
// @router 			/api/v1/clubs/{id} [put]
func (s *Handler) Update(ctx fiber.Ctx) error {
	var err error
	var clubId string

	reqBody := new(model.UpdateClubRequest)
	fctx := utils.FiberCtx{Fctx: ctx}

	if err = fctx.ParseJsonToStruct(reqBody, global.SPB_VALIDATOR); err != nil {
		logger.Errorf("error parse json to struct: %v", err)
		return fctx.ErrResponse(msg.UPDATE_UNIT_FAILED)
	}

	if clubId, err = fctx.ParseUUID("id"); err != nil {
		logger.Errorf("error parse club id: %v", err)
		return fctx.ErrResponse(msg.UPDATE_UNIT_FAILED)
	}

	clubUpdated, err := s.service.Update(reqBody, clubId)
	if err != nil {
		logger.Errorf("error create club: %v", err)
		return fctx.ErrResponse(msg.UPDATE_UNIT_FAILED)
	}

	clubResponse := utility.MapEntityToResponse(clubUpdated)
	return fctx.JsonResponse(fiber.StatusOK, msg.CODE_UPDATE_UNIT_SUCCESS, clubResponse)
}
