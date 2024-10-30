package service

import (
	tb "spb/bsa/pkg/entities"
)

// @author: LoanTT
// @function: GetByID
// @description: Service for get unitPrice
// @param: unitPriceId string, currentUnitPriceRoleName string
// @return: *tb.UnitPrice, error
func (s *Service) GetByID(unitPriceId string) (*tb.UnitPrice, error) {
	unitPrice := new(tb.UnitPrice)

	err := s.db.Where("id = ?", unitPriceId).Find(unitPrice).Error
	if err != nil {
		return nil, err
	}

	return unitPrice, nil
}
