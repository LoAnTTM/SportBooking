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
func (s *Service) Delete(unitId, ownerId string) error {
	unit := new(tb.Unit)
	if err := s.db.Model(&tb.Unit{}).
		Joins("JOIN club ON unit.club_id = club.id").
		Where("unit.id = ? AND club.owner_id = ?", unitId, ownerId).
		First(&unit).Error; err != nil {
		return msg.ErrUnitWrongOwner
	}

	if err := s.db.Delete(&unit).Error; err != nil {
		return err
	}
	return nil
}
