package service

import (
	"spb/bsa/api/auth/model"
	tb "spb/bsa/pkg/entities"
	"spb/bsa/pkg/global"
	"spb/bsa/pkg/notification"

	"gorm.io/gorm"
)

type IService interface {
	ForgotPassword(email string) error
	GoogleLogin(reqBody model.GoogleCallbackRequest) (*tb.User, error)
	AccountLogin(u *model.LoginRequest) (*tb.User, error)
	AccountRegister(u *model.RegisterRequest) (status AccountStatus, err error)
	ResendVerifyRegisterToken(reqBody *model.ResendVerifyRegisterTokenRequest) (err error)
	ResetPassword(reqBody *model.ResetPasswordRequest) (err error)
	SendVerifyEmail(token, email, notifyType string, tx *gorm.DB) (*notification.PushNotification, error)
	VerifyEmailNotification(otpToken string, user *tb.User, tx *gorm.DB) error
	VerifyRegisterToken(reqBody *model.VerifyRegisterTokenRequest) (err error)
	VerifyForgotPasswordToken(reqBody *model.VerifyForgotPasswordTokenRequest) (err error)
}

type Service struct {
	db *gorm.DB
}

// @author: LoanTT
// @function: NewService
// @description: Create a new auth service
// @return: IService
func NewService() IService {
	return &Service{db: global.SPB_DB}
}
