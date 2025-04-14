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
	// Check if unit exists
	if err := s.db.
		Preload("SportTypes").
		First(&unit, "id = ?", unitId).Error; err != nil {
		return msg.ErrNotFound("Unit")
	}

	if err := s.db.Delete(&unit).Error; err != nil {
		return err
	}
	return nil
}
