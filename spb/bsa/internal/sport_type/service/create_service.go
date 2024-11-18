package service

import (
	"spb/bsa/internal/sport_type/model"
	"spb/bsa/internal/sport_type/utility"
	tb "spb/bsa/pkg/entities"
	"spb/bsa/pkg/msg"
)

// @author: LoanTT
// @function: Create
// @description: Service for sportType creation
// @param: sportType model.CreateSportTypeRequest
// @return: sportType entities.SportType, error
func (s *Service) Create(reqBody *model.CreateSportTypeRequest) (*tb.SportType, error) {
	var count int64

	err := s.db.Model(&tb.SportType{}).Where("name = ?", reqBody.Name).Count(&count).Error
	if count > 0 || err != nil {
		return nil, msg.ErrSportTypeExists
	}

	sportType := utility.MapCreateRequestToEntity(reqBody)
	if err := s.db.Create(&sportType).Error; err != nil {
		return nil, err
	}

	return sportType, nil
}
