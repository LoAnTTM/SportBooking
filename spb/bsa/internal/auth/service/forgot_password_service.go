package service

import (
	notifyServ "spb/bsa/internal/notification"
	notifyModel "spb/bsa/internal/notification/model"
	userServ "spb/bsa/internal/user"
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
	if err := cache.SetVerifyToken(verifyToken, global.SPB_CONFIG.Cache.ResetPasswordExp); err != nil {
		tx.Rollback()
		return err
	}

	// send email
	notify, err := s.SendVerifyEmail(verifyToken, email, config.RESET_PASSWORD_NT, tx)
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
		NotificationType: config.RESET_PASSWORD_NT,
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
