package handler

import (
	"spb/bsa/pkg/logger"
	"spb/bsa/pkg/msg"
	"spb/bsa/pkg/utils"

	"github.com/gofiber/fiber/v3"
)

// Delete godoc
//
// @summary 		Delete user
// @description 	Delete user
// @tags 			users
// @accept  		json
// @produce 		json
// @param 			id path string true 			"User id"
// @success 		200 {object} utils.JSONResult{}	"Delete user success"
// @failure 		400 {object} utils.JSONResult{} "Delete user failed"
// @router 			/api/v1/users/{id} [delete]
func (s *Handler) Delete(ctx fiber.Ctx) error {
	var err error
	var userId string

	fctx := utils.FiberCtx{Fctx: ctx}
	if userId, err = fctx.ParseUUID("id"); err != nil {
		logger.Errorf("error parse user id: %v", err)
		return fctx.ErrResponse(msg.DELETE_USER_FAILED)
	}

	err = s.service.Delete(userId)
	if err != nil {
		logger.Errorf("error delete user: %v", err)
		return fctx.ErrResponse(msg.DELETE_USER_FAILED)
	}

	return fctx.JsonResponse(fiber.StatusOK, msg.CODE_DELETE_USER_SUCCESS)
}
