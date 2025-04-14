package service

import (
	mediaModel "spb/bsa/api/media/model"
	mediaUtil "spb/bsa/api/media/utility"
	tb "spb/bsa/pkg/entities"
	"spb/bsa/pkg/msg"
)

func (s *Service) AddMedia(clubId string, reqBody *mediaModel.CreateMediaRequest) error {
	// Check if club exists
	var count int64
	err := s.db.Model(&tb.Club{}).Where("id = ?", clubId).Count(&count).Error
	if err != nil {
		return err
	}
	if count == 0 {
		return msg.ErrNotFound("club")
	}

	// Create media record
	media := mediaUtil.MapCreateRequestToEntity(reqBody)
	media.OwnerID = clubId
	media.OwnerType = string(mediaModel.OwnerTypeClub)

	if err := s.db.Create(media).Error; err != nil {
		return msg.ErrCreateFailed("media", err)
	}

	return nil
}
