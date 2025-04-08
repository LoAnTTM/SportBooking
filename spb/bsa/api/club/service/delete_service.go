package service

import (
	"fmt"

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
	if err := s.db.Preload("Units").First(&club, "id = ?", clubId).Error; err != nil {
		return msg.ErrClubNotFound
	}

	// Start transaction
	tx := s.db.Begin()
	defer func() {
		if r := recover(); r != nil {
			tx.Rollback()
		}
	}()

	// Delete each unit manually to trigger hooks
	for _, unit := range club.Units {
		if err := tx.Delete(unit).Error; err != nil {
			tx.Rollback()
			return fmt.Errorf("failed to delete unit: %w", err)
		}
	}

	// Delete club record
	if err := tx.Delete(&club).Error; err != nil {
		tx.Rollback()
		return fmt.Errorf("failed to delete club: %w", err)
	}

	return tx.Commit().Error
}
