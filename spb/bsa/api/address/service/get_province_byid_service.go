package service

import tb "spb/bsa/pkg/entities"

func (s Service) GetProvinceByID(id string) (*tb.Province, error) {
	var province *tb.Province
	err := s.db.Model(&tb.Province{}).Where("id = ?", id).First(&province).Error
	if err != nil {
		return nil, err
	}
	return province, nil
}
