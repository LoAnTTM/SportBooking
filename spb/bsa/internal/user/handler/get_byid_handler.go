package handler

import (
	"spb/bsa/internal/user/utility"
	"spb/bsa/pkg/logger"
	"spb/bsa/pkg/utils"

	tb "spb/bsa/pkg/entities"

	"github.com/gofiber/fiber/v3"
	"github.com/golang-jwt/jwt/v5"
)

var (
	ErrGetUserFailed = fiber.NewError(fiber.StatusBadRequest, "error get user")
	ErrUserNotFound  = fiber.NewError(fiber.StatusNotFound, "user not found")
)

// GetByID godoc
//
// @summary 		Get user by id
// @description 	Get user by id
// @tags 			users
// @accept  		json
// @produce 		json
// @param 			id path string true "User ID"
// @success 		200 {object} utils.JSONResult{message=string}		"Get user by id success"
// @failure 		400 {object} utils.ErrorResult{message=string}      "Get user by id failed"
// @router 			/api/v1/users/{id} [delete]
func (s *Handler) GetByID(ctx fiber.Ctx) error {
	var err error
	var userId string
	var user *tb.User

	fctx := utils.FiberCtx{Fctx: ctx}
	if userId, err = fctx.ParseUUID("id"); err != nil {
		logger.Errorf("error parse user id: %v", err)
		return fctx.ErrResponse(ErrGetUserFailed)
	}

	claims := ctx.Locals("claims").(jwt.MapClaims)
	role := claims["role"].(string)
	if user, err = s.service.GetByID(userId, role); err != nil {
		logger.Errorf("error get user by id: %v", err)
		return fctx.ErrResponse(ErrUserNotFound)
	}

	userResponse := utility.MapUserEntityToResponse(user)
	return fctx.JsonResponse(fiber.StatusOK, userResponse)
}
