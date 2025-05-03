package service

import (
	tb "spb/bsa/pkg/entities"
)

// @author: LoanTT
// @function: GetRoles
// @description: Get available roles based on current user's role
// @param: currentUserRole string
// @return: []tb.Role, error
func (s *Service) GetRoles(currentUserRole string) ([]tb.Role, error) {
	var roles []tb.Role

	err := s.db.
		Preload("Permissions").
		Find(&roles).Error
	if err != nil {
		return nil, err
	}

	return roles, nil
}
