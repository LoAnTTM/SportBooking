package service

import (
	tb "spb/bsa/pkg/entities"
	"spb/bsa/pkg/msg"
)

// @author: LoanTT
// @function: Delete
// @description: Service for club deletion
// @param: string club id
// @return: error
func (s *Service) Delete(clubId string) error {
	// Check if club exists
	var club tb.Club
	if err := s.db.
		Preload("Units").
		Preload("SportTypes").
		First(&club, "id = ?", clubId).Error; err != nil {
		return msg.ErrNotFound("club")
	}

	// Delete club record
	if err := s.db.Delete(&club).Error; err != nil {
		return msg.ErrDeleteFailed("club", err)
	}

	return nil
}
