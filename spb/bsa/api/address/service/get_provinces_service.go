package service

import tb "spb/bsa/pkg/entities"

func (s Service) GetProvinces() ([]*tb.Province, error) {
	var provinces []*tb.Province
	err := s.db.Model(&tb.Province{}).Find(&provinces).Error
	if err != nil {
		return nil, err
	}
	return provinces, nil
}
