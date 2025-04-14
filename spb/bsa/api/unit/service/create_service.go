package service

import (
	mediaModel "spb/bsa/api/media/model"
	mediaServ "spb/bsa/api/media/service"
	spt "spb/bsa/api/sport_type"
	"spb/bsa/api/unit/model"
	"spb/bsa/api/unit/utility"
	tb "spb/bsa/pkg/entities"
	"spb/bsa/pkg/msg"
)

// @author: LoanTT
// @function: Create
// @description: Service for unit creation
// @param: unit model.CreateUnitRequest
// @return: unit entities.Unit, error
func (s *Service) Create(reqBody *model.CreateUnitRequest) (*tb.Unit, error) {
	var count int64
	if err := s.db.Model(&tb.Unit{}).
		Where("name = ?", reqBody.Name).
		Count(&count).Error; err != nil {
		return nil, err
	}
	if count > 0 {
		return nil, msg.ErrUniqueExists("Unit.name")
	}

	tx := s.db.Begin()
	defer func() {
		if r := recover(); r != nil {
			tx.Rollback()
		}
	}()

	// Check if sport types exist
	if isExist, err := spt.SportTypeService.CheckManyExist(reqBody.SportTypes); err != nil || !isExist {
		tx.Rollback()
		return nil, err
	}

	// Begin transaction
	unit := utility.MapCreateRequestToEntity(reqBody)
	if err := s.db.Create(unit).Error; err != nil {
		tx.Rollback()
		return nil, err
	}

	if len(reqBody.Media) > 0 {
		if _, err := mediaServ.CreateMedia(tx, reqBody.Media, unit.ID, mediaModel.OwnerTypeUnit); err != nil {
			return nil, msg.ErrCreateFailed("Media", err)
		}
	}

	// Commit transaction
	if err := tx.Commit().Error; err != nil {
		tx.Rollback()
		return nil, msg.ErrCommitFailed(err)
	}

	// get unit by id
	completedUnit, err := s.GetByID(unit.ID)
	if err != nil {
		return nil, err
	}

	return completedUnit, nil
}
