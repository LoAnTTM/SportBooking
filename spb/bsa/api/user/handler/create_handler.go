package handler

import (
	"spb/bsa/api/user/model"
	"spb/bsa/api/user/utility"
	"spb/bsa/pkg/global"
	"spb/bsa/pkg/logger"
	"spb/bsa/pkg/msg"
	"spb/bsa/pkg/utils"

	"github.com/gofiber/fiber/v3"
)

// Create godoc
//
// @summary 		Create user api
// @description 	Create user api
// @tags 			users
// @accept  		json
// @produce 		json
// @param 			user body model.CreateUserRequest true 				"Create user"
// @success 		200 {object} utils.JSONResult{data=model.UserResponse}	"Create user success"
// @failure 		400 {object} utils.JSONResult{}        					"Create user failed"
// @router 			/api/v1/users [post]
func (h *Handler) Create(ctx fiber.Ctx) error {
	reqBody := new(model.CreateUserRequest)
	fctx := utils.FiberCtx{Fctx: ctx}

	if err := fctx.ParseJsonToStruct(reqBody, global.SPB_VALIDATOR); err != nil {
		logger.Errorf(msg.ErrParseStructFailed("CreateUserRequest", err))
		return fctx.ErrResponse(msg.REQUEST_BODY_INVALID)
	}

	userCreated, err := h.service.Create(reqBody)
	if err != nil {
		logger.Errorf(msg.ErrCreateFailed("user", err))
		switch err {
		case msg.ErrEmailExists:
			return fctx.ErrResponse(msg.EMAIL_ALREADY_EXIST)
		default:
			return fctx.ErrResponse(msg.BAD_REQUEST)
		}
	}

	userResponse := utility.MapUserEntityToResponse(userCreated)
	return fctx.JsonResponse(fiber.StatusOK, msg.CODE_SUCCESS, userResponse)
}
