package service

import (
	"errors"

	"spb/bsa/internal/unit_price/model"
	tb "spb/bsa/pkg/entities"
	"spb/bsa/pkg/utils"
)

var ErrPermission = errors.New("unitPrice does not have permission")

// @author: LoanTT
// @function: GetAll
// @description: Service for get all unitPrices
// @param: *model.GetUnitPricesRequest
// @return: []*entities.UnitPrice, error
func (s *Service) GetAll(reqBody *model.GetUnitPricesRequest) ([]*tb.UnitPrice, error) {
	var unitPrices []*tb.UnitPrice

	err := s.db.
		Scopes(utils.Paginate(&reqBody.Pagination)).
		Where("unit_id = ?", reqBody.UnitID).
		Find(&unitPrices).Error
	if err != nil {
		return nil, err
	}

	return unitPrices, nil
}
