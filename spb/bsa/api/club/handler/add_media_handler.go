package handler

import (
	authModel "spb/bsa/api/auth/model"
	"spb/bsa/api/media/model"
	"spb/bsa/pkg/global"
	"spb/bsa/pkg/logger"
	"spb/bsa/pkg/msg"
	"spb/bsa/pkg/utils"

	"github.com/gofiber/fiber/v3"
)

// AddMedia godoc
//
// @summary 		Add media to club
// @description 	Add media to club
// @tags 			clubs
// @accept  		json
// @produce 		json
// @param 			id path string true "Club ID"
// @param 			media body model.CreateMediaRequest true "Media data"
// @success 		200 {object} utils.JSONResult{} "Add media to club success"
// @failure 		400 {object} utils.JSONResult{} "Add media to club failed"
// @router 			/api/v1/clubs/{id}/media [post]
func (h *Handler) AddMedia(ctx fiber.Ctx) error {
	var clubId string
	var err error
	reqBody := new(model.CreateMediaRequest)
	fctx := utils.FiberCtx{Fctx: ctx}

	if clubId, err = fctx.ParseUUID("id"); err != nil {
		logger.Errorf(msg.ErrParseUUIDFailed("club", err))
		return fctx.ErrResponse(msg.PARAM_INVALID)
	}

	if err = fctx.ParseJsonToStruct(reqBody, global.SPB_VALIDATOR); err != nil {
		logger.Errorf(msg.ErrParseStructFailed("CreateMediaRequest", err))
		return fctx.ErrResponse(msg.REQUEST_BODY_INVALID)
	}

	claims := ctx.Locals("claims").(authModel.UserClaims)
	userId := claims.UserID

	if err = h.service.AddMedia(reqBody, clubId, userId); err != nil {
		logger.Errorf(msg.ErrAddPropertyFailed("media", "club", err))
		switch err {
		case msg.ErrClubNotFound:
			return fctx.ErrResponse(msg.CLUB_NOT_FOUND)
		case msg.ErrClubWrongOwner:
			return fctx.ErrResponse(msg.CLUB_WRONG_OWNER)
		case msg.ErrMediaCreateFailed:
			return fctx.ErrResponse(msg.MEDIA_CREATE_FAILED)
		default:
			return fctx.ErrResponse(msg.BAD_REQUEST)
		}
	}

	return fctx.JsonResponse(fiber.StatusOK, msg.CODE_SUCCESS)
}
