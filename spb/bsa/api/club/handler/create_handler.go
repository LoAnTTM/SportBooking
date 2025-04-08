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

// Create godoc
//
// @summary 		Create club api
// @description 	Create club api
// @tags 			clubs
// @accept  		json
// @produce 		json
// @param 			Group body model.CreateClubRequest true 				"Create club"
// @success 		200 {object} utils.JSONResult{data=model.ClubResponse}	"Create club success"
// @failure 		400 {object} utils.JSONResult{}        					"Create club failed"
// @router 			/api/v1/clubs [post]
func (s *Handler) Create(ctx fiber.Ctx) error {
	reqBody := new(model.CreateClubRequest)
	fctx := utils.FiberCtx{Fctx: ctx}

	if err := fctx.ParseJsonToStruct(reqBody, global.SPB_VALIDATOR); err != nil {
		logger.Errorf("error parse json to struct: %v", err)
		return fctx.ErrResponse(msg.BAD_REQUEST)
	}

	clubCreated, err := s.service.Create(reqBody)
	if err != nil {
		logger.Errorf("error create club: %v", err)
		return fctx.ErrResponse(msg.BAD_REQUEST)
	}

	clubResponse := utility.MapEntityToResponse(clubCreated)
	return fctx.JsonResponse(fiber.StatusOK, msg.CODE_CREATE_CLUB_SUCCESS, clubResponse)
}
