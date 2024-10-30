package service

import (
	tb "spb/bsa/pkg/entities"
)

// @author: LoanTT
// @function: VerifyEmail
// @description: Verify email by token
// @param: token string
// @return: error
func (s *Service) VerifyEmail(token string) error {
	user := tb.User{}
	err := s.db.Where("email_verify_token = ?", token).First(&user).Error
	if err != nil {
		return err
	}

	if user.IsEmailVerified {
		return nil
	}

	user.IsEmailVerified = true
	user.EmailVerifyToken = nil

	if err := s.db.Save(&user).Error; err != nil {
		return err
	}

	return nil
}
