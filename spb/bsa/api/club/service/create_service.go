package service

import (
	"spb/bsa/api/club/model"
	"spb/bsa/api/club/utility"
	mediaModel "spb/bsa/api/media/model"
	mediaServ "spb/bsa/api/media/service"
	spt "spb/bsa/api/sport_type"
	tb "spb/bsa/pkg/entities"
	"spb/bsa/pkg/msg"
)

// @author: LoanTT
// @function: Create
// @description: Service for club creation
// @param: club model.CreateClubRequest
// @return: club entities.Club, error
func (s *Service) Create(reqBody *model.CreateClubRequest) (*tb.Club, error) {
	var count int64
	if err := s.db.Model(&tb.Club{}).
		Where("name = ?", reqBody.Name).
		Count(&count).Error; err != nil {
		return nil, err
	}
	if count > 0 {
		return nil, msg.ErrUniqueExists("club.name")
	}

	// Begin transaction
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

	club := utility.MapCreateRequestToEntity(reqBody)
	if err := tx.Create(club).Error; err != nil {
		tx.Rollback()
		return nil, err
	}

	if len(reqBody.Media) > 0 {
		if _, err := mediaServ.CreateMedia(tx, reqBody.Media, club.ID, mediaModel.OwnerTypeClub); err != nil {
			return nil, msg.ErrCreateFailed("media", err)
		}
	}

	// Commit transaction
	if err := tx.Commit().Error; err != nil {
		tx.Rollback()
		return nil, msg.ErrCommitFailed(err)
	}

	// get club by id
	completedClub, err := s.GetByID(club.ID)
	if err != nil {
		return nil, err
	}

	return completedClub, nil
}
