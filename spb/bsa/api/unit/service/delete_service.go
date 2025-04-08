package service

import (
	tb "spb/bsa/pkg/entities"
	"spb/bsa/pkg/msg"
)

// @author: LoanTT
// @function: Delete
// @description: Service for unit deletion
// @param: string unit id
// @return: error
func (s *Service) Delete(unitId string) error {
	unit := new(tb.Unit)
	// Check if club exists
	if err := s.db.First(&unit, "id = ?", unitId).Error; err != nil {
		return msg.ErrClubNotFound
	}

	err := s.db.Delete(&unit).Error
	if err != nil {
		return err
	}
	return nil
}
