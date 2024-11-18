package service

import (
	"fmt"

	"spb/bsa/internal/metadata"
	notifyTypeServ "spb/bsa/internal/notification_type"
	"spb/bsa/pkg/config"
	tb "spb/bsa/pkg/entities"
	"spb/bsa/pkg/entities/enum"
	"spb/bsa/pkg/global"
	"spb/bsa/pkg/logger"
	"spb/bsa/pkg/notification"

	"gorm.io/gorm"
)

// @author: LoanTT
// @function: SendVerifyEmail
// @description: Send verify email
// @param: token, email string, tx *gorm.DB
// @return: *notification.PushNotification, error
func (s *Service) SendVerifyEmail(token, email, notifyType string, tx *gorm.DB) (*notification.PushNotification, error) {
	var err error

	// Get metadata : operator email
	oEmailMeta, err := metadata.MetadataService.GetByKey(config.OPERATOR_EMAIL_KEY)
	if err != nil || oEmailMeta.Value == "" {
		tx.Rollback()
		return nil, logger.RErrorf("Can't get operator email: %v", err)
	}

	oEmailTemplate, err := notifyTypeServ.NotificationTypeService.GetByType(notifyType)
	if err != nil || oEmailTemplate.Template == "" {
		tx.Rollback()
		return nil, logger.RErrorf("Can't get notification template: %v", err)
	}

	var message string
	switch notifyType {
	case config.RESET_PASSWORD_NT:
		message, err = ResetPasswordMessage(token, email, oEmailTemplate)
	case config.VERIFY_USER_NT:
		message, err = RegisterMesssage(token, email, oEmailTemplate)
	default:
		panic("Invalid notify type")
	}

	if err != nil {
		tx.Rollback()
		return nil, logger.RErrorf("Can't make message: %v", err)
	}

	notify := &notification.PushNotification{
		ID:       token,
		Platform: enum.EMAIL,
		Title:    oEmailTemplate.Title,
		Message:  message,
		Charset:  "UTF-8",
		From:     oEmailMeta.Value,
		To:       []string{email},
	}

	// Send notification
	if err := global.SPB_NOTIFY.SendEmail(notify); err != nil {
		tx.Rollback()
		return nil, logger.RErrorf("Can't send notification: %v", err)
	}
	return notify, nil
}

// @author: LoanTT
// @function: ResetPasswordMessage
// @description: Make message for email template
// @param: verifyToken string
// @param: email string
// @param: oEmailTemplate *tb.NotificationType
// @return: string, error
func ResetPasswordMessage(verifyToken, email string, oEmailTemplate *tb.NotificationType) (string, error) {
	oEmailTemplateData := map[string]string{
		"VerificationLink": VerificationUrl(verifyToken, global.SPB_CONFIG.Server.ResetPasswordUri),
		"Name":             email,
		"CompanyName":      global.SPB_CONFIG.ProjectName,
		"Expire":           fmt.Sprintf("%d minutes", global.SPB_CONFIG.Cache.ResetPasswordExp),
	}

	temp := oEmailTemplate.MapTemplate(oEmailTemplateData)
	return temp, nil
}

// @author: LoanTT
// @function: RegisterMesssage
// @description: Make message for email template
// @param: verifyToken string
// @param: email string
// @param: oEmailTemplate *tb.NotificationType
// @return: string, error
func RegisterMesssage(verifyToken, email string, oEmailTemplate *tb.NotificationType) (string, error) {
	oEmailTemplateData := map[string]string{
		"VerificationLink": VerificationUrl(verifyToken, global.SPB_CONFIG.Server.VerifyEmailUri),
		"Name":             email,
		"CompanyName":      global.SPB_CONFIG.ProjectName,
	}

	temp := oEmailTemplate.MapTemplate(oEmailTemplateData)
	return temp, nil
}

// @author: LoanTT
// @function: VerificationUrl
// @description: Get verification url with token
// @param: token string
// @param: uri string
// @return: string
func VerificationUrl(token, uri string) string {
	address := global.SPB_CONFIG.Server.ClientAddr
	return address + uri + "?token=" + token
}
