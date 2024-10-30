package service

import (
	"spb/bsa/internal/user/utility"
	tb "spb/bsa/pkg/entities"
)

// @author: LoanTT
// @function: Delete
// @description: Service for user deletion
// @param: string user id
// @return: error
func (s *Service) Delete(userId string) error {
	user := tb.User{}
	user.ID = userId

	err := s.db.Scopes(utility.EmailIsVerity).Delete(&user).Error
	if err != nil {
		return err
	}
	return nil
}
