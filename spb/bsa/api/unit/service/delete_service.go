package service

import (
	tb "spb/bsa/pkg/entities"
)

// @author: LoanTT
// @function: Delete
// @description: Service for unit deletion
// @param: string unit id
// @return: error
func (s *Service) Delete(unitId string) error {
	unit := tb.Unit{}
	unit.ID = unitId

	err := s.db.Delete(&unit).Error
	if err != nil {
		return err
	}
	return nil
}
