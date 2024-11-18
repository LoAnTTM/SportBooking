package service

import (
	"spb/bsa/internal/auth/model"
	"spb/bsa/internal/auth/utility"
	tb "spb/bsa/pkg/entities"
)

// @author: LoanTT
// @function: RefreshToken
// @description: Get user by refresh token
// @param: refreshToken string
// @param: claims *model.UserClaims
// @return: *entities.User, error
func (s *Service) RefreshToken(refreshToken string, claims *model.UserClaims) (*tb.User, error) {
	var user *tb.User

	err := s.db.
		Scopes(utility.EmailIsVerity).
		Where("email = ?", claims.Email).
		Preload("Role").
		First(&user).Error
	if err != nil {
		return nil, err
	}

	return user, nil
}
