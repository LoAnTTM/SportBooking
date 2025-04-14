package handler

import (
	"spb/bsa/api/order/model"
	"spb/bsa/pkg/logger"
	"spb/bsa/pkg/msg"
	"spb/bsa/pkg/utils"

	"github.com/gofiber/fiber/v3"
)

// ZaloPayCallback godoc
//
// @summary 		ZaloPayCallback
// @description 	ZaloPayCallback
// @tags 			Order
// @accept  		json
// @produce 		json
// @param 			body body map[string]interface{} true "body"
// @success 		200 {object} utils.JSONResult{message=string}	"ZaloPayCallback success"
// @failure 		400 {object} utils.JSONResult{} 				"ZaloPayCallback failed"
// @router 			/api/v1/order/zalopay/callback [post]
func (h *Handler) ZaloPayCallback(ctx fiber.Ctx) error {
	var err error
	var response *model.CallBackResponse
	var body map[string]any
	fctx := utils.FiberCtx{Fctx: ctx}

	if err = ctx.Bind().Body(&body); err != nil {
		logger.Errorf(msg.ErrParseStructFailed("ZaloPayCallback", err))
		return fctx.ErrResponse(msg.REQUEST_BODY_INVALID)
	}

	if response, err = h.service.ZaloPayCallback(body); err != nil {
		logger.Errorf(msg.ErrMoMoCallbackFailed(err))
		return fctx.ErrResponse(msg.BAD_REQUEST)
	}

	return fctx.JsonResponse(fiber.StatusOK, msg.CODE_SUCCESS, response)
}
