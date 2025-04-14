package handler

import (
	"spb/bsa/api/order/utility"
	tb "spb/bsa/pkg/entities"
	"spb/bsa/pkg/logger"
	"spb/bsa/pkg/msg"
	"spb/bsa/pkg/utils"

	"github.com/gofiber/fiber/v3"
)

// GetByUserID godoc
//
// @summary 		GetByUserID
// @description 	GetByUserID
// @tags 			Order
// @accept  		json
// @produce 		json
// @param 			id path string true "user id"
// @success 		200 {object} utils.JSONResult{data=[]utility.OrderResponse}	"GetByUserID success"
// @failure 		400 {object} utils.JSONResult{} 							"GetByUserID failed"
// @router 			/api/v1/orders/{id} [get]
func (h *Handler) GetByUserID(ctx fiber.Ctx) error {
	var err error
	var userId string
	var orders []*tb.Order

	fctx := utils.FiberCtx{Fctx: ctx}
	if userId, err = fctx.ParseUUID("id"); err != nil {
		logger.Errorf(msg.ErrParseUUIDFailed("user", err))
		return fctx.ErrResponse(msg.PARAM_INVALID)
	}

	if orders, err = h.service.GetByUserID(userId); err != nil {
		logger.Errorf(msg.ErrGetFailed("user", err))
		return fctx.ErrResponse(msg.BAD_REQUEST)
	}

	response := utility.MapOrdersToResponse(orders)
	return fctx.JsonResponse(fiber.StatusOK, msg.CODE_SUCCESS, response)
}
