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
// @summary 		Delete media from unit
// @description 	Delete media from unit
// @tags 			units
// @accept  		json
// @produce 		json
// @param 			id path string true "Media ID"
// @success 		200 {object} utils.JSONResult{} "Delete media from unit success"
// @failure 		400 {object} utils.JSONResult{} "Delete media from unit failed"
// @router 			/api/v1/units/media/{id} [delete]
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
		case msg.ErrUnitWrongOwner:
			return fctx.ErrResponse(msg.UNIT_WRONG_OWNER)
		default:
			return fctx.ErrResponse(msg.BAD_REQUEST)
		}
	}

	return fctx.JsonResponse(fiber.StatusOK, msg.CODE_SUCCESS)
}
