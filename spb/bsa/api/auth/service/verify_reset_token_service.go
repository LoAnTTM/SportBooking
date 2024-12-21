package service

import (
	"spb/bsa/api/auth/model"
	"spb/bsa/pkg/cache"
	"spb/bsa/pkg/msg"
)

// @author: LoanTT
// @function: VerifyResetToken
// @description: Verify reset token
// @param: reqBody *model.VerifyTokenRequest
// @return: error
func (s *Service) VerifyResetToken(reqBody *model.VerifyTokenRequest) error {
	if ok := cache.VerifyToken.CheckVerifyToken(reqBody.Token); !ok {
		return msg.ErrTokenExpired
	}

	return nil
}
