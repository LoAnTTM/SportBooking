package service

import (
	notifyServ "spb/bsa/api/notification"
	notifyModel "spb/bsa/api/notification/model"
	userServ "spb/bsa/api/user"
	"spb/bsa/pkg/cache"
	"spb/bsa/pkg/config"
	"spb/bsa/pkg/entities/enum"
	"spb/bsa/pkg/global"
	"spb/bsa/pkg/logger"

	"github.com/google/uuid"
)

func (s *Service) ForgotPassword(email string) error {
	// check email exist
	_, err := userServ.UserService.GetByEmail(email)
	if err != nil {
		return err
	}
	tx := s.db.Begin()

	// generate token
	verifyToken := uuid.New().String()
	if err := cache.VerifyToken.SetVerifyToken(verifyToken, global.SPB_CONFIG.Cache.ResetPasswordExp); err != nil {
		tx.Rollback()
		return err
	}

	// send email
	notify, err := s.SendVerifyEmail(verifyToken, email, config.AUTH_RESET_PASSWORD, tx)
	if err != nil {
		tx.Rollback()
		return err
	}

	// Save notification with status inprogress
	notifyRequest := &notifyModel.CreateNotificationRequest{
		ID:               verifyToken, // Use token as notification ID
		Status:           enum.Progress(enum.INPROGRESS),
		Platform:         enum.Platform(enum.EMAIL),
		Title:            notify.Title,
		Message:          notify.Message,
		NotificationType: config.AUTH_RESET_PASSWORD,
	}

	// Create notification
	if _, err := notifyServ.NotificationService.Create(notifyRequest, tx); err != nil {
		tx.Rollback()
		return logger.RErrorf("Can't create notification: %v", err)
	}

	if err := tx.Commit().Error; err != nil {
		tx.Rollback()
		return err
	}

	return nil
}
