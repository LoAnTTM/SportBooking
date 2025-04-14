package service

import (
	"spb/bsa/api/auth/model"
	"spb/bsa/pkg/cache"
	"spb/bsa/pkg/config"
	tb "spb/bsa/pkg/entities"
	"spb/bsa/pkg/global"
	"spb/bsa/pkg/msg"
	"spb/bsa/pkg/utils"
)

// @author: LoanTT
// @function: ResendVerifyRegisterToken
// @description: Resend verify email OTP
// @param: reqBody *model.ResendVerifyRegisterTokenRequest
// @return: error
func (s *Service) ResendVerifyRegisterToken(reqBody *model.ResendVerifyRegisterTokenRequest) error {
	var err error
	user := new(tb.User)

	if err = s.db.Where("email = ?", reqBody.Email).First(user).Error; err != nil {
		return err
	}

	if user.IsEmailVerified {
		return msg.ErrEmailAlreadyVerified
	}

	tx := s.db.Begin()
	otpToken := utils.GenerateOTPCode(global.SPB_CONFIG.OTP.OTPLength)

	defer func() {
		if err == nil {
			RefreshOTPCache(otpToken, reqBody.Email)
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

func RefreshOTPCache(otpToken, email string) error {
	var err error

	previousOTPPattern := utils.Join(":", config.AUTH_OTP, email) + "*"
	previousOTP, err := cache.OTP.SearchOTP(previousOTPPattern)
	if err != nil {
		return err
	}

	defer func() {
		if err != nil {
			cache.OTP.DelOTP(previousOTP)
		}
	}()

	cacheToken := utils.Join(":", config.AUTH_OTP, email, otpToken)
	if err = cache.OTP.SetOTP(cacheToken, global.SPB_CONFIG.OTP.OTPExp); err != nil {
		return err
	}
	return nil
}
