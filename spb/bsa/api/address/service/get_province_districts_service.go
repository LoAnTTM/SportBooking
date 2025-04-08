package service

import tb "spb/bsa/pkg/entities"

func (s Service) GetProvinceDistricts(provinceID string) ([]*tb.District, error) {
	var districts []*tb.District
	err := s.db.Model(&tb.District{}).Where("province_id = ?", provinceID).Find(&districts).Error
	if err != nil {
		return nil, err
	}
	return districts, nil
}
