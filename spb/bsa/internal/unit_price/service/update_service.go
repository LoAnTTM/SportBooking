package service

import (
	"spb/bsa/internal/unit_price/model"
	"spb/bsa/internal/unit_price/utility"
	tb "spb/bsa/pkg/entities"
	"spb/bsa/pkg/msg"

	"gorm.io/gorm/clause"
)

// @author: LoanTT
// @function: Update
// @description: Service for unitPrice update
// @param: unitPrice model.UpdateUnitPriceRequest
// @param: string unitPrice id
// @return: unitPrice entities.UnitPrice, error
func (s *Service) Update(reqBody *model.UpdateUnitPriceRequest, unitPriceId string) (*tb.UnitPrice, error) {
	var err error
	var count int64
	var unit_prices []tb.UnitPrice

	// check unitPrice exists
	if err = s.db.Model(tb.UnitPrice{}).
		Where("id = ?", unitPriceId).
		Count(&count).Error; err == nil && count == 0 {
		return nil, msg.ErrUnitPriceNotFound
	} else if err != nil {
		return nil, err
	}

	// update unitPrice
	unitPriceUpdate := utility.MapUpdateRequestToEntity(reqBody)
	err = s.db.Model(&unit_prices).
		Clauses(clause.Returning{}).
		Where("id = ?", unitPriceId).
		Updates(unitPriceUpdate).Error
	if err != nil {
		return nil, err
	}
	if len(unit_prices) == 0 {
		return nil, msg.ErrUnitPriceNotFound
	}

	return &unit_prices[0], nil
}
