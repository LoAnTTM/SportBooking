package service

import (
	tb "spb/bsa/pkg/entities"
)

// @author: LoanTT
// @function: Delete
// @description: Service for location deletion
// @param: string location id
// @return: error
func (s *Service) Delete(locationId string) error {
	location := tb.Location{}
	location.ID = locationId

	err := s.db.Delete(&location).Error
	if err != nil {
		return err
	}
	return nil
}
