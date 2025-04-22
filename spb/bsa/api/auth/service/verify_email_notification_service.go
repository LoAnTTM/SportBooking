package service

import (
	notifyServ "spb/bsa/api/notification"
	notifyModel "spb/bsa/api/notification/model"
	"spb/bsa/pkg/config"
	tb "spb/bsa/pkg/entities"
	"spb/bsa/pkg/entities/enum"
	"spb/bsa/pkg/msg"

	"gorm.io/gorm"
)

// @author: LoanTT
// @function: VerifyEmailNotification
// @description: Verify email notification
// @param: otpToken string, user *tb.User, tx *gorm.DB
// @return: error
func (s *Service) VerifyEmailNotification(otpToken string, user *tb.User, tx *gorm.DB) error {
	notify, err := s.SendVerifyEmail(otpToken, user.Email, config.AUTH_VERIFY_EMAIL, tx)
	if err != nil {
		return err
	}

	// Save notification with status inprogress
	notifyRequest := &notifyModel.CreateNotificationRequest{
		ReceiverID:       &user.ID,
		Status:           enum.Progress(enum.INPROGRESS),
		Platform:         enum.Platform(enum.EMAIL),
		Title:            notify.Title,
		Message:          notify.Message,
		NotificationType: config.AUTH_VERIFY_EMAIL,
	}

	// Create notification
	if _, err := notifyServ.NotificationService.Create(notifyRequest, tx); err != nil {
		return msg.ErrVerifyEmailNotification
	}

	return nil
}
