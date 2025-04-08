package service

import tb "spb/bsa/pkg/entities"

func (s Service) GetWardByID(id string) (*tb.Ward, error) {
	var ward *tb.Ward
	err := s.db.Model(&tb.Ward{}).Where("id = ?", id).First(&ward).Error
	if err != nil {
		return nil, err
	}
	return ward, nil
}
