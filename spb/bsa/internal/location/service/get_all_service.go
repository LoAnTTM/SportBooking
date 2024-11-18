package service

import (
	tb "spb/bsa/pkg/entities"
)

// @author: LoanTT
// @function: GetAll
// @description: Service for get all locations
// @return: []*entities.Location, error
func (s *Service) GetAll() ([]*tb.Location, error) {
	var locations []*tb.Location

	err := s.db.Find(&locations).Error
	if err != nil {
		return nil, err
	}

	return locations, nil
}
