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
// @function: ResetPassword
// @description: Service for reset password
// @param: reqBody *model.ResetPasswordRequest
// @return: error
func (s *Service) ResetPassword(reqBody *model.ResetPasswordRequest) (err error) {
	otpCodeStr := strconv.Itoa(reqBody.Token)
	cacheToken := utils.ConcatStr(":", config.AUTH_OTP, reqBody.Email, otpCodeStr)
	if ok := cache.OTP.CheckOTP(cacheToken); !ok {
		return msg.ErrTokenExpired
	}

	defer func() {
		if err == nil {
			cache.OTP.DelOTP(cacheToken)
		}
	}()

	user := new(tb.User)
	err = s.db.Where("email = ?", reqBody.Email).First(user).Error
	if err != nil {
		return err
	}

	user.Password = utils.BcryptHash(reqBody.Password)
	if err = s.db.Save(user).Error; err != nil {
		return
	}

	// Update notification status
	err = notifyServ.NotificationService.UpdateStatus(user.ID, enum.Progress(enum.SUCCESS))
	if err != nil {
		return
	}

	return nil
}
