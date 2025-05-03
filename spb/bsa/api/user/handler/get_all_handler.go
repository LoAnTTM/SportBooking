package handler

import (
	"spb/bsa/api/user/model"
	"spb/bsa/api/user/utility"
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
// @param 			p query int false "Page number"
// @param 			i query int false "Number of items per page"
// @param 			b query string false "Order by"
// @param 			t query string false "Order type"
// @success 		200 {object} utils.JSONResult{data=[]model.UserResponse} "Get all users success"
// @failure 		400 {object} utils.JSONResult{} "Get all users failed"
// @router 			/api/v1/users [post]
func (h *Handler) GetAll(ctx fiber.Ctx) error {
	fctx := utils.FiberCtx{Fctx: ctx}
	reqBody := new(model.GetUsersRequest)

	pagination := model.GetPagination(ctx.Queries())
	reqBody.Pagination = *pagination

	// Get all users
	users, count, err := h.service.GetAll(reqBody)
	if err != nil {
		return fctx.ErrResponse(msg.NOT_FOUND)
	}

	response := utility.MapUsersEntityToResponse(users, count, reqBody)
	return fctx.JsonResponse(fiber.StatusOK, msg.CODE_SUCCESS, response)
}
