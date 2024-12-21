package service

import (
	"spb/bsa/api/auth/model"
	notifyServ "spb/bsa/api/notification"
	notifyModel "spb/bsa/api/notification/model"
	"spb/bsa/pkg/cache"
	"spb/bsa/pkg/config"
	tb "spb/bsa/pkg/entities"
	"spb/bsa/pkg/entities/enum"
	"spb/bsa/pkg/global"
	"spb/bsa/pkg/logger"
	"spb/bsa/pkg/msg"
	"spb/bsa/pkg/utils"

	"github.com/google/uuid"
)

// @author: LoanTT
// @function: AccountLogin
// @description: User login with email and password
// @param: user model.UserDTO
// @return: user entities.User, error
func (s *Service) AccountRegister(u *model.RegisterRequest) (*tb.User, error) {
	var existedUser tb.User
	var err error

	err = s.db.Model(&tb.User{}).Where("email = ?", u.Email).Find(&existedUser).Error
	if err != nil {
		return nil, err
	}

	if existedUser.ID != "" {
		if existedUser.IsEmailVerified {
			return nil, msg.ErrEmailExists
		}
		return nil, msg.ErrEmailVerifying
	}

	var role tb.Role
	err = s.db.Where("name = ?", tb.ROLE_USER).Preload("Permissions").First(&role).Error
	if err != nil {
		return nil, err
	}

	verifyToken := uuid.New().String()
	user := tb.User{
		Email:            u.Email,
		Password:         utils.BcryptHash(u.Password),
		Role:             role,
		RoleID:           role.ID,
		IsEmailVerified:  false,
		EmailVerifyToken: &verifyToken,
	}

	tx := s.db.Begin()
	if err := tx.Create(&user).Error; err != nil {
		tx.Rollback()
		return nil, err
	}

	if err := cache.VerifyToken.SetVerifyToken(verifyToken, global.SPB_CONFIG.Cache.VerifyEmailExp); err != nil {
		tx.Rollback()
		return nil, err
	}

	notify, err := s.SendVerifyEmail(verifyToken, u.Email, config.AUTH_VERIFY_EMAIL, tx)
	if err != nil {
		tx.Rollback()
		return nil, err
	}

	// Save notification with status inprogress
	notifyRequest := &notifyModel.CreateNotificationRequest{
		ID:               verifyToken,
		Status:           enum.Progress(enum.INPROGRESS),
		Platform:         enum.Platform(enum.EMAIL),
		Title:            notify.Title,
		Message:          notify.Message,
		NotificationType: config.AUTH_VERIFY_EMAIL,
	}

	// Create notification
	if _, err := notifyServ.NotificationService.Create(notifyRequest, tx); err != nil {
		tx.Rollback()
		return nil, logger.RErrorf("Can't create notification: %v", err)
	}

	if err := tx.Commit().Error; err != nil {
		tx.Rollback()
		return nil, err
	}
	return &user, nil
}
