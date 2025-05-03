package handler

import (
	authModel "spb/bsa/api/auth/model"
	"spb/bsa/pkg/logger"
	"spb/bsa/pkg/msg"
	"spb/bsa/pkg/utils"

	roleUtil "spb/bsa/api/role/utility"

	"github.com/gofiber/fiber/v3"
)

// GetRoles godoc
//
// @summary 		Get all user roles
// @description 	Get all available user roles based on current user's role
// @tags 			users
// @accept  		json
// @produce 		json
// @success 		200 {object} utils.JSONResult{data=[]model.RoleResponse} "Get roles success"
// @failure 		400 {object} utils.JSONResult{} "Get roles failed"
// @router 			/api/v1/users/roles [get]
func (h *Handler) GetRoles(ctx fiber.Ctx) error {
	fctx := utils.FiberCtx{Fctx: ctx}

	claims := ctx.Locals("claims").(authModel.UserClaims)
	currentUserRole := claims.Role

	roles, err := h.service.GetRoles(currentUserRole)
	if err != nil {
		logger.Errorf(msg.ErrGetFailed("roles", err))
		return fctx.ErrResponse(msg.BAD_REQUEST)
	}

	rolesResponse := roleUtil.MapRoleEntitiesToResponse(roles)
	return fctx.JsonResponse(fiber.StatusOK, msg.CODE_SUCCESS, rolesResponse)
}
