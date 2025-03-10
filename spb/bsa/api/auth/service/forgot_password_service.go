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
	"spb/bsa/pkg/utils"
)

func (s *Service) ForgotPassword(email string) error {
	// check email exist
	user, err := userServ.UserService.GetByEmail(email)
	if err != nil {
		return err
	}
	tx := s.db.Begin()

	// generate token
	otpToken := utils.GenerateOTPCode(global.SPB_CONFIG.OTP.OTPLength)
	cacheToken := utils.ConcatStr(":", config.AUTH_OTP, user.Email, otpToken)
	if err := cache.OTP.SetOTP(cacheToken, global.SPB_CONFIG.OTP.OTPExp); err != nil {
		tx.Rollback()
		return err
	}

	// send email
	notify, err := s.SendVerifyEmail(otpToken, email, config.AUTH_RESET_PASSWORD, tx)
	if err != nil {
		tx.Rollback()
		return err
	}

	// Save notification with status inprogress
	notifyRequest := &notifyModel.CreateNotificationRequest{
		SenderID:         &user.ID,
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
