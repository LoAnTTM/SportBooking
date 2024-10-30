package service

import (
	"spb/bsa/internal/unit_service/model"
	"spb/bsa/internal/unit_service/utility"
	tb "spb/bsa/pkg/entities"
)

// @author: LoanTT
// @function: Create
// @description: Service for unitService creation
// @param: reqBody *model.CreateUnitServiceRequest
// @return: unitService *entities.UnitService, error
func (s *Service) Create(reqBody *model.CreateUnitServiceRequest) (*tb.UnitService, error) {
	unitService := utility.MapCreateRequestToEntity(reqBody)

	err := s.db.Create(&unitService).Error
	if err != nil {
		return nil, err
	}
	return unitService, nil
}
