package service

import (
	tb "spb/bsa/pkg/entities"
)

// @author: LoanTT
// @function: GetByID
// @description: Service for get sportType by id
// @param: string sportType id
// @return: sportType entities.SportType, error
func (s *Service) GetByID(sportTypeId string) (*tb.SportType, error) {
	sportType := new(tb.SportType)

	if err := s.db.Where("id = ?", sportTypeId).Error; err != nil {
		return nil, err
	}

	return sportType, nil
}
