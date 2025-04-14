package handler

import (
	"spb/bsa/api/order/model"
	"spb/bsa/pkg/global"
	"spb/bsa/pkg/logger"
	"spb/bsa/pkg/msg"
	"spb/bsa/pkg/payment"
	"spb/bsa/pkg/utils"

	"github.com/gofiber/fiber/v3"
)

// Pay godoc
//
// @summary 		Pay
// @description 	Pay
// @tags 			payments
// @accept  		json
// @produce 		json
// @param 			body body payment.PaymentRequest true "body"
// @success 		200 {object} utils.JSONResult{message=string}	"Pay success"
// @failure 		400 {object} utils.JSONResult{} 				"Pay failed"
// @router 			/api/v1/payments [post]
func (h *Handler) Pay(ctx fiber.Ctx) error {
	var err error
	var response *payment.PaymentResponse
	reqBody := new(model.PayRequest)
	fctx := utils.FiberCtx{Fctx: ctx}

	if err = fctx.ParseJsonToStruct(reqBody, global.SPB_VALIDATOR); err != nil {
		logger.Errorf(msg.ErrParseStructFailed(err))
		return fctx.ErrResponse(msg.BAD_REQUEST)
	}

	if response, err = h.service.Pay(reqBody); err != nil {
		logger.Errorf(msg.ErrPaymentFailed(err))
		return fctx.ErrResponse(msg.BAD_REQUEST)
	}

	return fctx.JsonResponse(fiber.StatusOK, msg.CODE_SUCCESS, response)
}
