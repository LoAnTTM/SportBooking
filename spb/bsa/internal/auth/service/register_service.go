package service

import (
	"errors"

	"spb/bsa/internal/auth/model"
	"spb/bsa/internal/metadata"
	notifyServ "spb/bsa/internal/notification"
	notifyModel "spb/bsa/internal/notification/model"
	notifyTypeServ "spb/bsa/internal/notification_type"
	"spb/bsa/pkg/cache"
	"spb/bsa/pkg/config"
	tb "spb/bsa/pkg/entities"
	"spb/bsa/pkg/entities/enum"
	"spb/bsa/pkg/global"
	"spb/bsa/pkg/logger"
	"spb/bsa/pkg/notification"
	"spb/bsa/pkg/utils"

	"github.com/google/uuid"
)

var ErrEmailExists = errors.New("email already exists")

// @author: LoanTT
// @function: AccountLogin
// @description: User login with email and password
// @param: user model.UserDTO
// @return: user entities.User, error
func (s *Service) AccountRegister(u *model.RegisterRequest) (*tb.User, error) {
	var count int64
	var err error

	tx := s.db.Begin()
	s.db.Model(&tb.User{}).Where("email = ?", u.Email).Count(&count)
	if count > 0 {
		tx.Rollback()
		return nil, ErrEmailExists
	}

	var role tb.Role
	err = tx.Where("name = ?", tb.ROLE_USER).Preload("Permissions").First(&role).Error
	if err != nil {
		tx.Rollback()
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

	if err := tx.Create(&user).Error; err != nil {
		tx.Rollback()
		return nil, err
	}

	if err := cache.SetVerifyEmailToken(u.Email, verifyToken); err != nil {
		tx.Rollback()
		return nil, err
	}

	// Get metadata : operator email
	oEmailMeta, err := metadata.MetadataService.GetByKey(config.OPERATOR_EMAIL_KEY)
	if err != nil || oEmailMeta.Value == "" {
		tx.Rollback()
		return nil, logger.RErrorf("Can't get operator email: %v", err)
	}

	// Get notification template for email verify
	oEmailTemplate, err := notifyTypeServ.NotificationTypeService.GetByType(config.VERIFY_USER_NT)
	if err != nil || oEmailTemplate.Template == "" {
		tx.Rollback()
		return nil, logger.RErrorf("Can't get notification template: %v", err)
	}

	// Create message
	message, err := MakeMesssage(verifyToken, oEmailTemplate)
	if err != nil {
		tx.Rollback()
		return nil, logger.RErrorf("Can't make message: %v", err)
	}

	// Create push notification instance
	notify := &notification.PushNotification{
		ID:       uuid.New().String(),
		Platform: enum.EMAIL,
		Title:    oEmailTemplate.Title,
		Message:  message,
		Charset:  "utf-8",
		From:     oEmailMeta.Value,
		To:       []string{u.Email},
	}

	// Send notification
	if err := global.SPB_NOTIFY.SendEmail(notify); err != nil {
		tx.Rollback()
		return nil, logger.RErrorf("Can't send notification: %v", err)
	}

	// Save notification with status inprogress
	notifyRequest := &notifyModel.CreateNotificationRequest{
		ID:               notify.ID,
		Status:           enum.Progress(enum.INPROGRESS),
		Platform:         enum.Platform(enum.EMAIL),
		Title:            notify.Title,
		Message:          notify.Message,
		NotificationType: config.VERIFY_USER_NT,
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

// @author: LoanTT
// @function: MakeMesssage
// @description: Make message for email template
// @param: verifyToken string
// @param: oEmailTemplate *tb.NotificationType
// @return: string, error
func MakeMesssage(verifyToken string, oEmailTemplate *tb.NotificationType) (string, error) {
	oEmailTemplateData := map[string]string{
		"VerificationLink": VerificationUrl(verifyToken),
	}

	temp := oEmailTemplate.MapTemplate(oEmailTemplateData)
	return temp, nil
}

// @author: LoanTT
// @function: VerificationUrl
// @description: Get verification url with token
// @param: token string
// @return: string
func VerificationUrl(token string) string {
	baseUrl := global.SPB_CONFIG.GetServerUrl()
	return baseUrl + "/api/v1/auth/verify-email/" + token
}
