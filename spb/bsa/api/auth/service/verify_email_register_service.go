package service

import (
	"strconv"

	"spb/bsa/api/auth/model"
	notifyServ "spb/bsa/api/notification"
	"spb/bsa/pkg/cache"
	"spb/bsa/pkg/config"
	tb "spb/bsa/pkg/entities"
	"spb/bsa/pkg/entities/enum"
	"spb/bsa/pkg/msg"
	"spb/bsa/pkg/utils"
)

// @author: LoanTT
// @function: VerifyRegisterToken
// @description: Verify email when user register
// @param: reqBody *model.VerifyRegisterTokenRequest
// @return: error
func (s *Service) VerifyRegisterToken(reqBody *model.VerifyRegisterTokenRequest) (err error) {
	user := tb.User{}

	otpCodeStr := strconv.Itoa(reqBody.Token)
	cacheToken := utils.ConcatStr(":", config.AUTH_OTP, reqBody.Email, otpCodeStr)
	if ok := cache.OTP.CheckOTP(cacheToken); !ok {
		err = msg.ErrTokenExpired
		return
	}

	defer func() {
		if err == nil {
			cache.OTP.DelOTP(cacheToken)
		}
	}()

	err = s.db.Where("email = ?", reqBody.Email).First(&user).Error
	if err != nil || user.IsEmailVerified {
		return err
	}

	user.IsEmailVerified = true
	if err = s.db.Save(&user).Error; err != nil {
		return
	}

	// Update notification status
	err = notifyServ.NotificationService.UpdateStatus(user.ID, enum.Progress(enum.SUCCESS))
	if err != nil {
		return
	}
	return nil
}
