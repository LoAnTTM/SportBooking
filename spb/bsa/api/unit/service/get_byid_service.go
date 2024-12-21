package service

import (
	tb "spb/bsa/pkg/entities"
)

// @author: LoanTT
// @function: GetByID
// @description: Service for get unit
// @param: unitId string, currentUnitRoleName string
// @return: *tb.Unit, error
func (s *Service) GetByID(unitId, currentUnitRoleName string) (*tb.Unit, error) {
	unit := new(tb.Unit)

	err := s.db.Where("id = ?", unitId).First(unit).Error
	if err != nil {
		return nil, err
	}

	return unit, nil
}
