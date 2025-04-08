package service

import (
	"spb/bsa/api/address/model"
	tb "spb/bsa/pkg/entities"
)

func (s Service) SearchByIDs(reqBody *model.SearchByIDRequest) ([]*tb.Ward, error) {
	var wards []*tb.Ward
	query := s.db.Model(&tb.Ward{})

	if reqBody.WardID != "" {
		query = query.Where("id = ?", reqBody.WardID)
	} else if reqBody.DistrictID != "" {
		query = query.Preload("District").Where("district_id = ?", reqBody.DistrictID)
	} else if reqBody.ProvinceID != "" {
		query = query.Preload("District.Province").Where("district_id IN (SELECT id FROM districts WHERE province_id = ?)", reqBody.ProvinceID)
	}

	err := query.Find(&wards).Error
	if err != nil {
		return nil, err
	}
	return wards, nil
}
