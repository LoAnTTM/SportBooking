package service

import (
	"spb/bsa/api/unit/model"
	"spb/bsa/api/unit/utility"
	tb "spb/bsa/pkg/entities"
	"spb/bsa/pkg/msg"
)

// @author: LoanTT
// @function: Create
// @description: Service for unit creation
// @param: unit model.CreateUnitRequest
// @return: unit entities.Unit, error
func (s *Service) Create(reqBody *model.CreateUnitRequest) (*tb.Unit, error) {
	var count int64

	err := s.db.Model(&tb.Unit{}).
		Where("club_id = ?", reqBody.ClubID).
		Where("name = ?", reqBody.Name).
		Count(&count).Error
	if count > 0 || err != nil {
		return nil, msg.ErrUnitNameExists
	}

	unit := utility.MapCreateRequestToEntity(reqBody)
	if err := s.db.Create(unit).Error; err != nil {
		return nil, err
	}

	return unit, nil
}
