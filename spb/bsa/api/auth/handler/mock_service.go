package handler

import (
	"spb/bsa/api/auth/model"
	"spb/bsa/api/auth/service"
	tb "spb/bsa/pkg/entities"
	"spb/bsa/pkg/notification"

	"github.com/stretchr/testify/mock"
	"gorm.io/gorm"
)

// MockService is a mock implementation of the auth service interface
type MockService struct {
	mock.Mock
}

// ForgotPassword mocks the ForgotPassword method
func (m *MockService) ForgotPassword(email string) error {
	args := m.Called(email)
	return args.Error(0)
}

// GoogleLogin mocks the GoogleLogin method
func (m *MockService) GoogleLogin(reqBody model.GoogleCallbackRequest) (*tb.User, error) {
	args := m.Called(reqBody)
	if args.Get(0) == nil {
		return nil, args.Error(1)
	}
	return args.Get(0).(*tb.User), args.Error(1)
}

// AccountLogin mocks the AccountLogin method
func (m *MockService) AccountLogin(u *model.LoginRequest) (*tb.User, error) {
	args := m.Called(u)
	if args.Get(0) == nil {
		return nil, args.Error(1)
	}
	return args.Get(0).(*tb.User), args.Error(1)
}

// AccountRegister mocks the AccountRegister method
func (m *MockService) AccountRegister(u *model.RegisterRequest) (status service.AccountStatus, err error) {
	args := m.Called(u)
	return args.Get(0).(service.AccountStatus), args.Error(1)
}

// ResendVerifyRegisterToken mocks the ResendVerifyRegisterToken method
func (m *MockService) ResendVerifyRegisterToken(reqBody *model.ResendVerifyRegisterTokenRequest) (err error) {
	args := m.Called(reqBody)
	return args.Error(0)
}

// ResetPassword mocks the ResetPassword method
func (m *MockService) ResetPassword(reqBody *model.ResetPasswordRequest) (err error) {
	args := m.Called(reqBody)
	return args.Error(0)
}

// SendVerifyEmail mocks the SendVerifyEmail method
func (m *MockService) SendVerifyEmail(token, email, notifyType string, tx *gorm.DB) (*notification.PushNotification, error) {
	args := m.Called(token, email, notifyType, tx)
	if args.Get(0) == nil {
		return nil, args.Error(1)
	}
	return args.Get(0).(*notification.PushNotification), args.Error(1)
}

// VerifyEmailNotification mocks the VerifyEmailNotification method
func (m *MockService) VerifyEmailNotification(otpToken string, user *tb.User, tx *gorm.DB) error {
	args := m.Called(otpToken, user, tx)
	return args.Error(0)
}

// VerifyRegisterToken mocks the VerifyRegisterToken method
func (m *MockService) VerifyRegisterToken(reqBody *model.VerifyRegisterTokenRequest) (err error) {
	args := m.Called(reqBody)
	return args.Error(0)
}

// VerifyForgotPasswordToken mocks the VerifyForgotPasswordToken method
func (m *MockService) VerifyForgotPasswordToken(reqBody *model.VerifyForgotPasswordTokenRequest) (err error) {
	args := m.Called(reqBody)
	return args.Error(0)
}

// ChangePassword mocks the ChangePassword method
func (m *MockService) ChangePassword(userID string, reqBody *model.ChangePasswordRequest) (err error) {
	args := m.Called(userID, reqBody)
	return args.Error(0)
}
