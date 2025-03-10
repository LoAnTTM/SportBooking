package service

import (
	"fmt"

	"spb/bsa/api/metadata"
	notifyTypeServ "spb/bsa/api/notification_type"
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
	case config.AUTH_RESET_PASSWORD:
		message, err = ResetPasswordMessage(token, email, oEmailTemplate)
	case config.AUTH_VERIFY_EMAIL:
		message, err = RegisterMessage(token, email, oEmailTemplate)
	default:
		panic("Invalid notify type")
	}

	if err != nil {
		tx.Rollback()
		logger.Errorf("Can't make message: %v", err)
		return nil, err
	}

	notify := &notification.PushNotification{
		ID:       token,
		Platform: enum.EMAIL,
		Type:     notifyType,
		Title:    oEmailTemplate.Title,
		Message:  message,
		Charset:  "UTF-8",
		From:     oEmailMeta.Value,
		To:       []string{email},
	}

	// Send notification
	if err := global.SPB_NOTIFY.Notify(notify); err != nil {
		tx.Rollback()
		logger.Errorf("Can't send notification: %v", err)
		return nil, err
	}
	return notify, nil
}

// @author: LoanTT
// @function: ResetPasswordMessage
// @description: Make message for email template
// @param: otpCode string
// @param: email string
// @param: oEmailTemplate *tb.NotificationType
// @return: string, error
func ResetPasswordMessage(otpCode, email string, oEmailTemplate *tb.NotificationType) (string, error) {
	oEmailTemplateData := map[string]string{
		"OTPCode":     otpCode,
		"Name":        email,
		"CompanyName": global.SPB_CONFIG.ProjectName,
		"Expire":      fmt.Sprintf("%d minutes", global.SPB_CONFIG.OTP.OTPExp),
	}

	temp := oEmailTemplate.MapTemplate(oEmailTemplateData)
	return temp, nil
}

// @author: LoanTT
// @function: RegisterMessage
// @description: Make message for email template
// @param: otpCode string
// @param: email string
// @param: oEmailTemplate *tb.NotificationType
// @return: string, error
func RegisterMessage(otpCode, email string, oEmailTemplate *tb.NotificationType) (string, error) {
	oEmailTemplateData := map[string]string{
		"OTPCode":     otpCode,
		"Name":        email,
		"CompanyName": global.SPB_CONFIG.ProjectName,
		"Expire":      fmt.Sprintf("%d minutes", global.SPB_CONFIG.OTP.OTPExp),
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
