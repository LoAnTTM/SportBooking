package handler

import (
	"spb/bsa/internal/user/model"
	"spb/bsa/internal/user/utility"
	"spb/bsa/pkg/global"
	"spb/bsa/pkg/logger"
	"spb/bsa/pkg/utils"

	"github.com/gofiber/fiber/v3"
)

var ErrUpdateUserFailed = fiber.NewError(fiber.StatusBadRequest, "update user failed")

// Update godoc
//
// @summary 		Update user by id
// @description 	Update user by id
// @tags 			users
// @accept  		json
// @produce 		json
// @param 			user body model.UpdateUserRequest true "User data"
// @success 		200 {object} utils.JSONResult{data=model.UserResponse}		"Update user by id success"
// @failure 		400 {object} utils.ErrorResult{message=string}      "Update user by id failed"
// @router 			/api/v1/users/{id} [patch]
func (s *Handler) Update(ctx fiber.Ctx) error {
	var err error
	var userId string
	reqBody := new(model.UpdateUserRequest)

	fctx := utils.FiberCtx{Fctx: ctx}
	if err = fctx.ParseJsonToStruct(reqBody, global.SPB_VALIDATOR); err != nil {
		logger.Errorf("error parse json to struct: %v", err)
		return fctx.ErrResponse(ErrUpdateUserFailed)
	}
	if userId, err = fctx.ParseUUID("id"); err != nil {
		logger.Errorf("error parse user id: %v", err)
		return fctx.ErrResponse(ErrUpdateUserFailed)
	}

	userUpdated, err := s.service.Update(reqBody, userId)
	if err != nil {
		logger.Errorf("error create user: %v", err)
		return fctx.ErrResponse(ErrUpdateUserFailed)
	}
	userResponse := utility.MapUserEntityToResponse(userUpdated)

	return fctx.JsonResponse(fiber.StatusOK, userResponse)
}
