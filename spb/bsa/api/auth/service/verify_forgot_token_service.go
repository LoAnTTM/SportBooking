package service

import (
	"strconv"

	"spb/bsa/api/auth/model"
	"spb/bsa/pkg/cache"
	"spb/bsa/pkg/config"
	"spb/bsa/pkg/msg"
	"spb/bsa/pkg/utils"
)

// @author: LoanTT
// @function: VerifyForgotPasswordToken
// @description: Verify reset token
// @param: reqBody *model.VerifyForgotPasswordTokenRequest
// @return: error
func (s *Service) VerifyForgotPasswordToken(reqBody *model.VerifyForgotPasswordTokenRequest) (err error) {
	cacheToken := utils.Join(":", config.AUTH_OTP, reqBody.Email, strconv.Itoa(reqBody.Token))
	if ok := cache.OTP.CheckOTP(cacheToken); !ok {
		err = msg.ErrTokenExpired
		return
	}

	cache.OTP.DelOTP(cacheToken)
	return nil
}
