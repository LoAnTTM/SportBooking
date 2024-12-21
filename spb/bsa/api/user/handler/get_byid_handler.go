package handler

import (
	"spb/bsa/api/user/utility"
	"spb/bsa/pkg/logger"
	"spb/bsa/pkg/msg"
	"spb/bsa/pkg/utils"

	authModel "spb/bsa/api/auth/model"
	tb "spb/bsa/pkg/entities"

	"github.com/gofiber/fiber/v3"
)

// GetByID godoc
//
// @summary 		Get user by id
// @description 	Get user by id
// @tags 			users
// @accept  		json
// @produce 		json
// @param 			id path string true 			"User ID"
// @success 		200 {object} utils.JSONResult{}	"Get user by id success"
// @failure 		400 {object} utils.JSONResult{} "Get user by id failed"
// @router 			/api/v1/users/{id} [get]
func (s *Handler) GetByID(ctx fiber.Ctx) error {
	var err error
	var userId string
	var user *tb.User

	fctx := utils.FiberCtx{Fctx: ctx}
	if userId, err = fctx.ParseUUID("id"); err != nil {
		logger.Errorf("error parse user id: %v", err)
		return fctx.ErrResponse(msg.GET_USER_FAILED)
	}

	claims := ctx.Locals("claims").(authModel.UserClaims)
	role := claims.Role
	if user, err = s.service.GetByID(userId, role); err != nil {
		logger.Errorf("error get user by id: %v", err)
		return fctx.ErrResponse(msg.USER_NOTFOUND)
	}

	userResponse := utility.MapUserEntityToResponse(user)
	return fctx.JsonResponse(fiber.StatusOK, msg.CODE_GET_USER_SUCCESS, userResponse)
}
