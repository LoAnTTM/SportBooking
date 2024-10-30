package service

import tb "spb/bsa/pkg/entities"

// @author: LoanTT
// @function: Delete
// @description: Service for unitService deletion
// @param: string unitService id
// @return: error
func (s *Service) Delete(unitServiceId string) error {
	unitService := tb.UnitService{}
	unitService.ID = unitServiceId

	err := s.db.Delete(&unitService).Error
	if err != nil {
		return err
	}
	return nil
}
