package service

import (
	"spb/bsa/internal/location/model"
	"spb/bsa/internal/location/utility"
	tb "spb/bsa/pkg/entities"
)

// @author: LoanTT
// @function: Create
// @description: Service for location creation
// @param: location model.CreateLocationRequest
// @return: location entities.Location, error
func (s *Service) Create(reqBody *model.CreateLocationRequest) ([]*tb.Location, error) {
	locations := utility.MapCreateRequestToEntities(reqBody)
	if err := s.db.Create(&locations).Error; err != nil {
		return nil, err
	}

	return locations, nil
}
