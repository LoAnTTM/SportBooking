package handler

import (
	"spb/bsa/api/auth/model"
	"spb/bsa/pkg/global"
	"spb/bsa/pkg/logger"
	"spb/bsa/pkg/msg"
	"spb/bsa/pkg/utils"

	"github.com/gofiber/fiber/v3"
)

// ChangePassword godoc
//
// @summary		Change password api
// @description	Change password api for authenticated users
// @tags	 	auth
// @accept		json
// @produce		json
// @param		group body model.ChangePasswordRequest true  "Change password"
// @success		200 {object} utils.JSONResult{}				"Change password success"
// @failure		400 {object} utils.JSONResult{}				"Change password failed"
// @failure		401 {object} utils.JSONResult{}				"Unauthorized"
// @router		/api/v1/auth/change-password [post]
func (h *Handler) ChangePassword(ctx fiber.Ctx) error {
	// Parse request
	reqBody := new(model.ChangePasswordRequest)
	fctx := utils.FiberCtx{Fctx: ctx}

	if err := fctx.ParseJsonToStruct(reqBody, global.SPB_VALIDATOR); err != nil {
		logger.Errorf(msg.ErrParseStructFailed("ChangePasswordRequest", err))
		return fctx.ErrResponse(msg.REQUEST_BODY_INVALID)
	}

	// Get user ID from claims
	claims := ctx.Locals("claims").(model.UserClaims)
	userID := claims.UserID

	// Call service to change password
	if err := h.service.ChangePassword(userID, reqBody); err != nil {
		logger.Errorf(msg.ErrChangePasswordFailed(err))
		if err == msg.ErrUnauthorized {
			return fctx.ErrResponse(msg.UNAUTHORIZED)
		} else if err == msg.ErrIncorrectPassword {
			return fctx.ErrResponse(msg.INCORRECT_PASSWORD)
		}
		return fctx.ErrResponse(msg.BAD_REQUEST)
	}

	return fctx.JsonResponse(fiber.StatusOK, msg.CODE_SUCCESS)
}
