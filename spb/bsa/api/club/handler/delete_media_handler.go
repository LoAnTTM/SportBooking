package handler

import (
	authModel "spb/bsa/api/auth/model"
	"spb/bsa/pkg/logger"
	"spb/bsa/pkg/msg"
	"spb/bsa/pkg/utils"

	"github.com/gofiber/fiber/v3"
)

// DeleteMedia godoc
//
// @summary 		Delete media from club
// @description 	Delete media from club
// @tags 			clubs
// @accept  		json
// @produce 		json
// @param 			id path string true "Media ID"
// @success 		200 {object} utils.JSONResult{} "Delete media from club success"
// @failure 		400 {object} utils.JSONResult{} "Delete media from club failed"
// @router 			/api/v1/clubs/media/{id} [delete]
func (h *Handler) DeleteMedia(ctx fiber.Ctx) error {
	var err error
	var mediaId string

	fctx := utils.FiberCtx{Fctx: ctx}
	if mediaId, err = fctx.ParseUUID("id"); err != nil {
		logger.Errorf(msg.ErrParseUUIDFailed("media", err))
		return fctx.ErrResponse(msg.PARAM_INVALID)
	}

	claims := ctx.Locals("claims").(authModel.UserClaims)
	userId := claims.UserID

	if err = h.service.DeleteMedia(mediaId, userId); err != nil {
		logger.Errorf(msg.ErrDeleteFailed("media", err))
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
