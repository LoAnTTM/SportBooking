package handler

import (
	"spb/bsa/internal/user/model"
	"spb/bsa/internal/user/utility"
	"spb/bsa/pkg/global"
	"spb/bsa/pkg/logger"
	"spb/bsa/pkg/utils"

	"github.com/gofiber/fiber/v3"
)

var ErrCreateUserFailed = fiber.NewError(fiber.StatusBadRequest, "create user failed")

// Create godoc
//
// @summary 		Create user
// @description 	Create user
// @tags 			users
// @accept  		json
// @produce 		json
// @param 			Group body model.CreateUserRequest true "Create user"
// @success 		200 {object} utils.JSONResult{data=model.UserResponse}		"Create user success"
// @failure 		400 {object} utils.ErrorResult{message=string}        		"Create user failed"
// @router 			/api/v1/users [post]
func (s *Handler) Create(ctx fiber.Ctx) error {
	var err error
	reqBody := new(model.CreateUserRequest)

	fctx := utils.FiberCtx{Fctx: ctx}
	if err = fctx.ParseJsonToStruct(reqBody, global.SPB_VALIDATOR); err != nil {
		logger.Errorf("error parse json to struct: %v", err)
		return fctx.ErrResponse(ErrCreateUserFailed)
	}
	userCreated, err := s.service.Create(reqBody)
	if err != nil {
		logger.Errorf("error create user: %v", err)
		return fctx.ErrResponse(ErrCreateUserFailed)
	}
	// TODO: send email verification
	userResponse := utility.MapUserEntityToResponse(userCreated)

	return fctx.JsonResponse(fiber.StatusOK, userResponse)
}
