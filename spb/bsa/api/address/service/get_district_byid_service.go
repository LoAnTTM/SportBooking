package service

import tb "spb/bsa/pkg/entities"

func (s Service) GetDistrictByID(id string) (*tb.District, error) {
	var district *tb.District
	err := s.db.Model(&tb.District{}).Where("id = ?", id).First(&district).Error
	if err != nil {
		return nil, err
	}
	return district, nil
}
