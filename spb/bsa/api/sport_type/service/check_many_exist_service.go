package service

import (
	tb "spb/bsa/pkg/entities"
	"spb/bsa/pkg/msg"
)

func (s *Service) CheckManyExist(ids []string) (bool, error) {
	var count int64
	err := s.db.Model(&tb.SportType{}).Where("id IN ?", ids).Count(&count).Error
	if err != nil {
		return false, err
	}
	if count != int64(len(ids)) {
		return false, msg.ErrSportTypeNotFound
	}
	return true, nil
}
