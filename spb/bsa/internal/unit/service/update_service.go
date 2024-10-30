package service

import (
	"errors"

	"spb/bsa/internal/unit/model"
	"spb/bsa/internal/unit/utility"
	tb "spb/bsa/pkg/entities"

	"gorm.io/gorm/clause"
)

var (
	ErrUnitNotFound     = errors.New("unit not found")
	ErrUpdateUnitFailed = errors.New("update unit failed")
)

// @author: LoanTT
// @function: Update
// @description: Service for unit update
// @param: unit model.UpdateUnitRequest
// @param: string unit id
// @return: unit entities.Unit, error
func (s *Service) Update(reqBody *model.UpdateUnitRequest, unitId string) (*tb.Unit, error) {
	var err error
	var count int64
	var units []tb.Unit

	// check if unit exists
	if err = s.db.Model(tb.Unit{}).
		Where("id = ?", unitId).
		Count(&count).Error; err == nil && count == 0 {
		return nil, ErrUnitNotFound
	} else if err != nil {
		return nil, err
	}

	// update unit
	unitUpdate := utility.MapUpdateRequestToEntity(reqBody)
	err = s.db.Model(&units).
		Clauses(clause.Returning{}).
		Where("id = ?", unitId).
		Updates(unitUpdate).Error
	if err != nil {
		return nil, err
	}
	if len(units) == 0 {
		return nil, ErrUpdateUnitFailed
	}

	return &units[0], nil
}
