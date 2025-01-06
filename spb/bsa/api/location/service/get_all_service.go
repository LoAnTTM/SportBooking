package service

import (
	"spb/bsa/api/location/model"
	tb "spb/bsa/pkg/entities"
	"spb/bsa/pkg/utils"
)

// @author: LoanTT
// @function: GetAll
// @description: Service for get all locations
// @param: *model.GetLocationsRequest
// @return: []*entities.Location, int64, error
func (s *Service) GetAll(reqBody *model.GetLocationsRequest) ([]*tb.Location, int64, error) {
	var locations []*tb.Location
	var count int64

	err := s.db.Model(tb.Location{}).Count(&count).Error
	if err != nil {
		return nil, 0, err
	}

	err = s.db.Scopes(utils.Paginate(&reqBody.Pagination)).Find(&locations).Error
	if err != nil {
		return nil, 0, err
	}

	return locations, count, nil
}
