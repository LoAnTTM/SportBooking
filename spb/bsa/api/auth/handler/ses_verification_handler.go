package handler

import (
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
// @router		/api/v1/auth/ses-verify [post]
func (h *Handler) SendVerification(ctx fiber.Ctx) error {
	reqBody := new(model.SendVerificationRequest)
	fctx := utils.FiberCtx{Fctx: ctx}

	if err := fctx.ParseJsonToStruct(reqBody, global.SPB_VALIDATOR); err != nil {
		logger.Errorf(msg.ErrParseStructFailed("SendVerificationRequest", err))
		return fctx.ErrResponse(msg.REQUEST_BODY_INVALID)
	}

	awsSession, err := aws.NewAWSSession(global.SPB_CONFIG)
	if err != nil {
		panic(msg.ErrAWSConnectFailed(err))
	}

	sesService := ses.NewSESService(awsSession)
	_, err = sesService.SendVerification(reqBody.Email)
	if err != nil {
		logger.Errorf(msg.ErrSendOTPFailed(err))
		return fctx.ErrResponse(msg.BAD_REQUEST)
	}

	return fctx.JsonResponse(fiber.StatusOK, msg.CODE_SUCCESS)
}
