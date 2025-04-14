package service

import (
	"spb/bsa/api/sport_type/model"
	"spb/bsa/api/sport_type/utility"
	tb "spb/bsa/pkg/entities"
	"spb/bsa/pkg/msg"

	"gorm.io/gorm/clause"
)

// @author: LoanTT
// @function: Update
// @description: Service for sportType update
// @param: sportType model.UpdateSportTypeRequest
// @param: string sportType id
// @return: error
func (s *Service) Update(reqBody *model.UpdateSportTypeRequest, sportTypeId string) error {
	var count int64
	var sportTypes []tb.SportType

	// check if sportType exists
	if err := s.db.Model(tb.SportType{}).
		Where("id = ?", sportTypeId).
		Count(&count).Error; err == nil && count == 0 {
		return msg.ErrNotFound("SportType")
	} else if err != nil {
		return err
	}

	// update sportType
	sportTypeUpdate := utility.MapUpdateRequestToEntity(reqBody)
	err := s.db.Model(&sportTypes).
		Clauses(clause.Returning{}).
		Where("id = ?", sportTypeId).
		Updates(sportTypeUpdate).Error
	if err != nil {
		return err
	}
	if len(sportTypes) == 0 {
		return msg.ErrNotFound("SportType")
	}

	return nil
}
