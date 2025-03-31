package service

import (
	"spb/bsa/api/location/model"
	tb "spb/bsa/pkg/entities"
)

// @author: LoanTT
// @function: Search
// @description: Service for search location
// @param: reqBody *model.SearchLocationRequest
// @return: []*tb.Location, error
func (s *Service) Search(reqBody *model.SearchLocationRequest) ([]*tb.Location, error) {
	locations := make([]*tb.Location, 0)
	var count int64

	err := s.db.Model(tb.Location{}).Count(&count).Error
	if err != nil {
		return nil, err
	}

	err = s.db.Where(&tb.Location{
		Province: reqBody.Province,
		City:     reqBody.City,
		District: reqBody.District,
	}).
		Find(&locations).Error
	if err != nil {
		return nil, err
	}

	return locations, nil
}
