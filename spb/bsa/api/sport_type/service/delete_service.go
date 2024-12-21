package service

import (
	tb "spb/bsa/pkg/entities"
)

// @author: LoanTT
// @function: Delete
// @description: Service for sportType deletion
// @param: string sportType id
// @return: error
func (s *Service) Delete(sportTypeId string) error {
	sportType := tb.SportType{}
	sportType.ID = sportTypeId

	err := s.db.Delete(&sportType).Error
	if err != nil {
		return err
	}
	return nil
}
