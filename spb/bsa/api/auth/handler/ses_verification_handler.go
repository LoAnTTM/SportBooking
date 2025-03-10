package handler

import (
	"fmt"

	"spb/bsa/api/auth/model"
	"spb/bsa/pkg/aws"
	"spb/bsa/pkg/aws/ses"
	"spb/bsa/pkg/global"
	"spb/bsa/pkg/logger"
	"spb/bsa/pkg/msg"
	"spb/bsa/pkg/utils"

	"github.com/gofiber/fiber/v3"
)

// SendVerification godoc
//
// @summary		Send verification email api
// @description	Send verification email api
// @tags	 	auth
// @accept		json
// @produce		json
// @param		group body model.SendVerificationRequest true  "Send verification email"
// @success		200 {object} utils.JSONResult{}				"Send verification email success"
// @failure		400 {object} utils.JSONResult{}				"Send verification email failed"
func (h *Handler) SendVerification(ctx fiber.Ctx) error {
	reqBody := new(model.SendVerificationRequest)
	fctx := utils.FiberCtx{Fctx: ctx}

	if err := fctx.ParseJsonToStruct(reqBody, global.SPB_VALIDATOR); err != nil {
		logger.Errorf("parse json to struct failed: %v", err)
		return fctx.ErrResponse(msg.SERVER_ERROR)
	}

	awsSession, err := aws.NewAWSSession(global.SPB_CONFIG)
	if err != nil {
		panic(fmt.Sprintf("failed to connect aws: %v\n", err))
	}

	sesService := ses.NewSESService(awsSession)
	_, err = sesService.SendVerification(reqBody.Email)
	if err != nil {
		logger.Errorf("send verification failed: %v", err)
		return fctx.ErrResponse(msg.SERVER_ERROR)
	}

	return fctx.JsonResponse(fiber.StatusOK, msg.CODE_SES_VERIFY_SUCCESS)
}
