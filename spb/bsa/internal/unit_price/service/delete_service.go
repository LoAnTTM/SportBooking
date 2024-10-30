package service

import (
	tb "spb/bsa/pkg/entities"
)

// @author: LoanTT
// @function: Delete
// @description: Service for unitPrice deletion
// @param: string unitPrice id
// @return: error
func (s *Service) Delete(unitPriceId string) error {
	unitPrice := tb.UnitPrice{}
	unitPrice.ID = unitPriceId

	err := s.db.Delete(&unitPrice).Error
	if err != nil {
		return err
	}
	return nil
}
