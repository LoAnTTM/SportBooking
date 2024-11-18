package service

import (
	tb "spb/bsa/pkg/entities"
)

// @author: LoanTT
// @function: GetAll
// @description: Get all permissions
// @return: []*tb.Permission, error
func (s *Service) GetAll() ([]*tb.Permission, error) {
	var permissions []*tb.Permission

	if err := s.db.Find(&permissions).Error; err != nil {
		return nil, err
	}
	return permissions, nil
}
