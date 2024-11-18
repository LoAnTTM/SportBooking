package handler

import (
	authModel "spb/bsa/internal/auth/model"
	"spb/bsa/internal/user/model"
	"spb/bsa/internal/user/utility"
	"spb/bsa/pkg/logger"
	"spb/bsa/pkg/msg"
	"spb/bsa/pkg/utils"

	"github.com/gofiber/fiber/v3"
)

// GetAll godoc
//
// @summary 		Get all users
// @description 	Get all users
// @tags 			users
// @accept  		json
// @produce 		json
// @param 			i query int false 											"Number items on page"
// @param 			p query int false 											"Page number"
// @param			b query string false 										"Order by"
// @param			t query string false 										"Order type"
// @success 		200 {object} utils.JSONResult{data=model.GetUsersResponse}	"Get all users success"
// @failure 		404 {object} utils.JSONResult{}        						"Get all users failed"
// @router 			/api/v1/users [get]
func (s *Handler) GetAll(ctx fiber.Ctx) error {
	var err error
	reqBody := new(model.GetUsersRequest)
	fctx := utils.FiberCtx{Fctx: ctx}

	pagination := utils.GetPagination(ctx.Queries())
	reqBody.Pagination = pagination

	claims := ctx.Locals("claims").(authModel.UserClaims)
	reqBody.Role = claims.Role

	users, err := s.service.GetAll(reqBody)
	if err != nil {
		logger.Errorf("error get users: %v", err)
		return fctx.ErrResponse(msg.GET_USER_FAILED)
	}

	userResponse := utility.MapUsersEntityToResponse(users, reqBody)
	return fctx.JsonResponse(fiber.StatusOK, msg.CODE_GET_USER_SUCCESS, userResponse)
}
