package service

import tb "spb/bsa/pkg/entities"

func (s Service) GetDistrictWards(districtID string) ([]*tb.Ward, error) {
	var wards []*tb.Ward
	err := s.db.Model(&tb.Ward{}).Where("district_id = ?", districtID).Find(&wards).Error
	if err != nil {
		return nil, err
	}
	return wards, nil
}
