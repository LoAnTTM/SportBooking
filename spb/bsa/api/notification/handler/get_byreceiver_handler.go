package handler

import (
	"spb/bsa/api/notification/model"
	"spb/bsa/api/notification/utility"
	"spb/bsa/pkg/logger"
	"spb/bsa/pkg/msg"
	"spb/bsa/pkg/utils"

	"github.com/gofiber/fiber/v3"
)

// GetByReceiver godoc
//
// @summary 		Get notifications by receiver
// @description 	Get notifications by receiver
// @tags 			notifications
// @accept  		json
// @produce 		json
// @param 			id path string true "Receiver ID"
// @param 			p query int false "Page number"
// @param 			i query int false "Number of items per page"
// @param 			b query string false "Order by"
// @param 			t query string false "Order type"
// @success 		200 {object} utils.JSONResult{data=model.NotificationsResponse} "Get notifications by receiver success"
// @failure 		400 {object} utils.JSONResult{} "Get notifications by receiver failed"
// @router 			/api/v1/notifications/receiver/{id} [get]
func (h *Handler) GetByReceiver(ctx fiber.Ctx) error {
	var userID string
	var err error
	reqBody := new(model.GetNotificationsRequest)

	fctx := utils.FiberCtx{Fctx: ctx}
	if userID, err = fctx.ParseUUID("id"); err != nil {
		logger.Errorf(msg.ErrParseUUIDFailed("notification.receiver", err))
		return fctx.ErrResponse(msg.PARAM_INVALID)
	}

	reqBody.UserID = userID
	pagination := utils.GetPagination(ctx.Queries(), model.ORDER_BY)
	reqBody.Pagination = pagination

	notifications, count, err := h.service.GetByReceiver(reqBody)
	if err != nil {
		logger.Errorf(msg.ErrGetFailed("notification.receiver", err))
		return fctx.ErrResponse(msg.BAD_REQUEST)
	}

	res := utility.MapEntitiesToResponse(notifications, count, reqBody)
	return fctx.JsonResponse(fiber.StatusOK, msg.CODE_SUCCESS, res)
}
