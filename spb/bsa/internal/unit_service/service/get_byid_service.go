package service

import (
	tb "spb/bsa/pkg/entities"
)

// @author: LoanTT
// @function: GetByID
// @description: Service for get unitService by id
// @param: unitServiceId string
// @return: *entities.UnitService, error
func (s *Service) GetByID(unitServiceId string) (*tb.UnitService, error) {
	unitService := new(tb.UnitService)

	err := s.db.Where("id = ?", unitServiceId).First(unitService).Error
	if err != nil {
		return nil, err
	}

	return unitService, nil
}
