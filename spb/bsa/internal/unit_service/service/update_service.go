package service

import (
	"spb/bsa/internal/unit_service/model"
	"spb/bsa/internal/unit_service/utility"
	tb "spb/bsa/pkg/entities"
	"spb/bsa/pkg/msg"

	"gorm.io/gorm/clause"
)

// @author: LoanTT
// @function: Update
// @description: Service for unitService update
// @param: unitService *model.UpdateUnitServiceRequest
// @return: unitService *entities.UnitService, error
func (s *Service) Update(reqBody *model.UpdateUnitServiceRequest, unitServiceId string) (*tb.UnitService, error) {
	var err error
	var count int64
	var unitServices []tb.UnitService

	// check if unitService exists
	if err = s.db.Model(&tb.UnitService{}).
		Where("id = ?", unitServiceId).
		Count(&count).Error; err == nil && count == 0 {
		return nil, msg.ErrUnitServiceNotFound
	} else if err != nil {
		return nil, err
	}

	unitServiceUpdate := utility.MapUpdateRequestToEntity(reqBody)
	// update unitService
	err = s.db.Model(&unitServices).
		Clauses(clause.Returning{}).
		Where("id = ?", unitServiceId).
		Updates(unitServiceUpdate).Error
	if err != nil {
		return nil, err
	}
	if len(unitServices) == 0 {
		return nil, msg.ErrUnitServiceNotFound
	}

	return &unitServices[0], nil
}
