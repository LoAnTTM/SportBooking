package handler

import (
	authModel "spb/bsa/api/auth/model"
	"spb/bsa/api/club/model"
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
		logger.Errorf(msg.ErrParseStructFailed("UpdateClubRequest", err))
		return fctx.ErrResponse(msg.REQUEST_BODY_INVALID)
	}

	if clubId, err = fctx.ParseUUID("id"); err != nil {
		logger.Errorf(msg.ErrParseUUIDFailed("club", err))
		return fctx.ErrResponse(msg.PARAM_INVALID)
	}

	claims := ctx.Locals("claims").(authModel.UserClaims)
	userId := claims.UserID

	if err = s.service.Update(reqBody, clubId, userId); err != nil {
		logger.Errorf(msg.ErrUpdateFailed("club", err))
		switch err {
		case msg.ErrClubNotFound:
			return fctx.ErrResponse(msg.CLUB_NOT_FOUND)
		case msg.ErrClubWrongOwner:
			return fctx.ErrResponse(msg.CLUB_WRONG_OWNER)
		default:
			return fctx.ErrResponse(msg.BAD_REQUEST)
		}
	}

	return fctx.JsonResponse(fiber.StatusOK, msg.CODE_SUCCESS)
}
