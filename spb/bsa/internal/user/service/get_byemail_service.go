package service

import (
	"spb/bsa/internal/user/utility"
	tb "spb/bsa/pkg/entities"
)

// @author: LoanTT
// @function: GetByEmail
// @description: Service for get user
// @param: email string
// @return: *tb.User, error
func (s *Service) GetByEmail(email string) (*tb.User, error) {
	var err error
	user := new(tb.User)

	err = s.db.Scopes(utility.EmailIsVerity).
		Preload("Role").
		Where("email = ?", email).First(user).Error
	if err != nil {
		return nil, err
	}

	return user, nil
}
