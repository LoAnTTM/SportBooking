package handler

import (
	"spb/bsa/api/user/model"
	"spb/bsa/pkg/global"
	"spb/bsa/pkg/logger"
	"spb/bsa/pkg/msg"
	"spb/bsa/pkg/utils"

	"github.com/gofiber/fiber/v3"
)

// Update godoc
//
// @summary 		Update user by id
// @description 	Update user by id
// @tags 			users
// @accept  		json
// @produce 		json
// @param 			user body model.UpdateUserRequest true 					"User data"
// @success 		200 {object} utils.JSONResult{data=model.UserResponse}	"Update user by id success"
// @failure 		400 {object} utils.JSONResult{}							"Update user by id failed"
// @router 			/api/v1/users/{id} [put]
func (s *Handler) Update(ctx fiber.Ctx) error {
	var err error
	var userId string
	reqBody := new(model.UpdateUserRequest)

	fctx := utils.FiberCtx{Fctx: ctx}
	if userId, err = fctx.ParseUUID("id"); err != nil {
		logger.Errorf(msg.ErrParseUUIDFailed("User", err))
		return fctx.ErrResponse(msg.PARAM_INVALID)
	}

	if err = fctx.ParseJsonToStruct(reqBody, global.SPB_VALIDATOR); err != nil {
		logger.Errorf(msg.ErrParseStructFailed("UpdateUserRequest", err))
		return fctx.ErrResponse(msg.REQUEST_BODY_INVALID)
	}

	if err := s.service.Update(reqBody, userId); err != nil {
		logger.Errorf(msg.ErrUpdateFailed("User", err))
		return fctx.ErrResponse(msg.BAD_REQUEST)
	}

	return fctx.JsonResponse(fiber.StatusOK, msg.CODE_SUCCESS)
}
