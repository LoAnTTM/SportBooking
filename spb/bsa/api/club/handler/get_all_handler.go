package handler

import (
	"spb/bsa/api/club/model"
	"spb/bsa/api/club/utility"
	"spb/bsa/pkg/msg"
	"spb/bsa/pkg/utils"

	"github.com/gofiber/fiber/v3"
)

// GetAll godoc
//
// @summary 		Get all clubs
// @description 	Get all clubs
// @tags 			clubs
// @accept  		json
// @produce 		json
// @param 			p query int false "Page number"
// @param 			i query int false "Number of items per page"
// @param 			b query string false "Order by"
// @param 			t query string false "Order type"
// @success 		200 {object} utils.JSONResult{data=[]model.ClubResponse} "Get all clubs success"
// @failure 		400 {object} utils.JSONResult{} "Get all clubs failed"
// @router 			/api/v1/clubs [get]
func (h Handler) GetAll(ctx fiber.Ctx) error {
	reqBody := new(model.GetClubsRequest)
	fctx := utils.FiberCtx{Fctx: ctx}

	pagination := utils.GetPagination(ctx.Queries(), model.ORDER_BY)
	reqBody.Pagination = pagination

	// Get all clubs
	clubs, count, err := h.service.GetAll(reqBody)
	if err != nil {
		return fctx.ErrResponse(msg.NOT_FOUND)
	}

	response := utility.MapEntitiesToResponse(clubs, count, reqBody)
	return fctx.JsonResponse(fiber.StatusOK, msg.CODE_GET_CLUB_SUCCESS, response)
}
