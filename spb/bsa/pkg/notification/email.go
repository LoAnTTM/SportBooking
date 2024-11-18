package notification

import (
	"context"

	"spb/bsa/pkg/aws/ses"
	"spb/bsa/pkg/config"
	"spb/bsa/pkg/entities/enum"
	"spb/bsa/pkg/logger"
	"spb/bsa/pkg/msg"
)

var ESInstance EmailService

type EmailService interface {
	SendNotification(ctx context.Context, data *PushNotification, cfg *config.Config) (*ResponsePush, error)
}

func NewEmailService(sesService ses.SESService) {
	ESInstance = &emailService{
		sesService: sesService,
	}
}

type emailService struct {
	sesService ses.SESService
}

func (e *emailService) SendNotification(ctx context.Context, data *PushNotification, cfg *config.Config) (*ResponsePush, error) {
	email := EmailInfoFromPushNotification(data)
	logger.Infof("Send email to %v", email.To)

	resp := new(ResponsePush)
	output, err := e.sesService.SendEmail(email)
	if err != nil {
		resp.Logs = append(resp.Logs, logPush(data,
			string(enum.FAILURE), config.VERIFY_USER_NT, msg.ErrEmailSendFailed(err)))
		return resp, err
	}

	logger.Infof(output.String())
	resp.Logs = append(resp.Logs, logPush(data, string(enum.SUCCESS), config.VERIFY_USER_NT, nil))

	return resp, nil
}

func EmailInfoFromPushNotification(data *PushNotification) *ses.EmailInfo {
	return &ses.EmailInfo{
		ID:      data.ID,
		From:    data.From,
		To:      data.To,
		Cc:      data.Cc,
		Bcc:     data.Bcc,
		Title:   data.Title,
		Charset: data.Charset,
		Message: data.Message,
	}
}

func logPush(req *PushNotification, status, notifyType string, err error) NotificationEntry {
	var errMsg string
	if err != nil {
		errMsg = err.Error()
	}
	return NotificationEntry{
		ID:       req.ID,
		Status:   status,
		Type:     notifyType,
		Platform: req.Platform,
		Title:    req.Title,
		Message:  req.Message,
		Error:    errMsg,
	}
}
