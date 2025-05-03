package service

import (
	"fmt"

	"spb/bsa/api/address/model"
	tb "spb/bsa/pkg/entities"
)

// @author: LoanTT
// @function: SearchByGeography
// @description: This function searches for addresses within a specified radius from a given geographical point.
// @param: longitude, latitude float64, radius int
// @return: []*model.AddressWithDistance, error
func (s *Service) SearchByGeography(longitude, latitude float64, radius int) ([]*model.AddressWithDistance, error) {
	var result []*model.AddressWithDistance

	point := fmt.Sprintf("SRID=4326;POINT(%f %f)", longitude, latitude)
	err := s.db.Model(&tb.Address{}).
		Select("id, address, ward_id, ST_AsGeoJSON(location_geography) as location_geography, ST_Distance(location_geography::geography, ST_GeogFromText(?)) as distance", point).
		Where("ST_DWithin(location_geography::geography, ST_GeogFromText(?), ?)", point, radius).
		Order("distance ASC").
		Scan(&result).Error
	if err != nil {
		return nil, err
	}

	return result, nil
}
