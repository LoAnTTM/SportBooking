package service

import (
	tb "spb/bsa/pkg/entities"
)

// @author: LoanTT
// @function: GetAll
// @description: Service for get all sport types
// @return: []*entities.SportType, error
func (s *Service) GetAll() ([]*tb.SportType, error) {
	var sportTypes []*tb.SportType

	if err := s.db.Find(&sportTypes).Error; err != nil {
		return nil, err
	}

	return sportTypes, nil
}
