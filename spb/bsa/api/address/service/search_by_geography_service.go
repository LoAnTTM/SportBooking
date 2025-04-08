package service

import (
	"fmt"

	tb "spb/bsa/pkg/entities"
)

// @author: LoanTT
// @function: SearchByGeography
// @description: This function searches for addresses within a specified radius from a given geographical point.
// @param: longitude, latitude float64, radius int
// @return: []*tb.Address, error
func (s *Service) SearchByGeography(longitude, latitude float64, radius int) ([]*tb.Address, error) {
	var addresses []*tb.Address

	point := fmt.Sprintf("SRID=4326;POINT(%f %f)", longitude, latitude)
	err := s.db.Model(&tb.Address{}).
		Select("id, address, ward_id, ST_AsGeoJSON(location_geography) as location_geography").
		Where("ST_DWithin(location_geography::geography, ST_GeogFromText(?), ?)", point, radius).
		Scan(&addresses).Error
	if err != nil {
		return nil, err
	}

	return addresses, nil
}
