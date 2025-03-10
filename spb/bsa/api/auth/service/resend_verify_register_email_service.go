package service

import (
	"fmt"

	"spb/bsa/api/auth/model"
	"spb/bsa/pkg/cache"
	"spb/bsa/pkg/config"
	tb "spb/bsa/pkg/entities"
	"spb/bsa/pkg/global"
	"spb/bsa/pkg/utils"
)

// @author: LoanTT
// @function: ResendVerifyRegisterToken
// @description: Resend verify email OTP
// @param: reqBody *model.ResendVerifyRegisterTokenRequest
// @return: error
func (s *Service) ResendVerifyRegisterToken(reqBody *model.ResendVerifyRegisterTokenRequest) (err error) {
	user := new(tb.User)

	err = s.db.Where("email = ?", reqBody.Email).First(user).Error
	if err != nil {
		return
	}

	if user.IsEmailVerified {
		err = fmt.Errorf("email already verified")
		return
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
		return
	}

	if err = tx.Commit().Error; err != nil {
		tx.Rollback()
		return
	}

	return nil
}

func RefreshOTPCache(otpToken, email string) error {
	previousOTPPattern := utils.ConcatStr(":", config.AUTH_OTP, email) + "*"
	previousOTP, err := cache.OTP.SearchOTP(previousOTPPattern)
	if err != nil {
		return err
	}

	cache.OTP.DelOTP(previousOTP)

	cacheToken := utils.ConcatStr(":", config.AUTH_OTP, email, otpToken)
	if err := cache.OTP.SetOTP(cacheToken, global.SPB_CONFIG.OTP.OTPExp); err != nil {
		return err
	}
	return nil
}
