package service

import (
	"spb/bsa/api/auth/model"
	"spb/bsa/pkg/cache"
	"spb/bsa/pkg/config"
	tb "spb/bsa/pkg/entities"
	"spb/bsa/pkg/global"
	"spb/bsa/pkg/msg"
	"spb/bsa/pkg/utils"

	"gorm.io/gorm"
)

type AccountStatus int

const (
	AccountExisted AccountStatus = iota
	AccountVerifying
	AccountNotExists
	SocialProvider
	Error
)

// @author: LoanTT
// @function: AccountLogin
// @description: User login with email and password
// @param: user model.UserDTO
// @return: *AccountStatus, *tb.User, error
func (s *Service) AccountRegister(u *model.RegisterRequest) (status AccountStatus, err error) {
	user := new(tb.User)
	if status, user, err = checkAccountStatus(s.db, u); err != nil {
		return
	}

	switch status {
	case AccountExisted:
		// response error email exists
		err = msg.ErrEmailExists
	case SocialProvider:
		// add password to user created by social provider
		err = addPasswordToUser(s.db, user, u.Password, s)
	case AccountVerifying:
		// resend otp code and response email verifying code
		err = resendOTP(s.db, user, s)
	case AccountNotExists:
		// create new account
		_, err = createAccount(s.db, u, s)
	}

	return
}

// @author: LoanTT
// @function: checkAccountStatus
// @description: Check account status (email exists, email verifying, email not exists, social provider)
// @param: db *gorm.DB, u *model.RegisterRequest
func checkAccountStatus(db *gorm.DB, u *model.RegisterRequest) (AccountStatus, *tb.User, error) {
	var existedUser []*tb.User

	err := db.Model(&tb.User{}).
		Preload("AuthenticationProviders").
		Where("email = ?", u.Email).Find(&existedUser).Error
	if err != nil {
		return Error, nil, err
	}

	// email not exist
	if len(existedUser) == 0 {
		return AccountNotExists, nil, nil
	}

	// account created by email and password
	if existedUser[0].IsEmailVerified {
		return AccountExisted, nil, nil
	}

	// account is created by social provider and not have password
	if len(existedUser[0].AuthenticationProviders) > 0 && existedUser[0].Password == "" {
		return SocialProvider, existedUser[0], nil
	}

	return AccountVerifying, existedUser[0], nil
}

// @author: LoanTT
// @function: createAccount
// @description: Create account for user
// @param: db *gorm.DB, u *model.RegisterRequest, s *Service
// @return: *entities.User, error
func createAccount(db *gorm.DB, u *model.RegisterRequest, s *Service) (*tb.User, error) {
	var role tb.Role
	err := db.Where("name = ?", tb.ROLE_USER).Preload("Permissions").First(&role).Error
	if err != nil {
		return nil, err
	}

	otpToken := utils.GenerateOTPCode(global.SPB_CONFIG.OTP.OTPLength)
	user := tb.User{
		Email:           u.Email,
		Password:        utils.BcryptHash(u.Password),
		Role:            role,
		RoleID:          role.ID,
		IsEmailVerified: false,
	}

	tx := db.Begin()
	if err := tx.Create(&user).Error; err != nil {
		tx.Rollback()
		return nil, err
	}

	cacheToken := utils.Join(":", config.AUTH_OTP, user.Email, otpToken)
	if err := cache.OTP.SetOTP(cacheToken, global.SPB_CONFIG.OTP.OTPExp); err != nil {
		tx.Rollback()
		return nil, err
	}

	if err := s.VerifyEmailNotification(otpToken, &user, tx); err != nil {
		tx.Rollback()
		return nil, err
	}

	if err := tx.Commit().Error; err != nil {
		tx.Rollback()
		return nil, err
	}

	return &user, nil
}

// @author: LoanTT
// @function: addPasswordToUser
// @description: Add password to user created by social provider
// @param: db *gorm.DB, user *entities.User, password string, s *Service
// @return: error
func addPasswordToUser(db *gorm.DB, user *tb.User, password string, s *Service) (err error) {
	user.Password = utils.BcryptHash(password)

	tx := db.Begin()
	if err = tx.Save(&user).Error; err != nil {
		tx.Rollback()
		return err
	}

	otpToken := utils.GenerateOTPCode(global.SPB_CONFIG.OTP.OTPLength)
	defer func() {
		if err == nil {
			RefreshOTPCache(otpToken, user.Email)
		}
	}()

	if err = s.VerifyEmailNotification(otpToken, user, tx); err != nil {
		tx.Rollback()
		return
	}

	if err = tx.Commit().Error; err != nil {
		tx.Rollback()
		return
	}

	return
}

func resendOTP(db *gorm.DB, user *tb.User, s *Service) (err error) {
	tx := db.Begin()
	otpToken := utils.GenerateOTPCode(global.SPB_CONFIG.OTP.OTPLength)

	defer func() {
		if err == nil {
			RefreshOTPCache(otpToken, user.Email)
		}
	}()

	if err = s.VerifyEmailNotification(otpToken, user, tx); err != nil {
		tx.Rollback()
		return err
	}

	if err = tx.Commit().Error; err != nil {
		tx.Rollback()
		return err
	}

	return nil
}
