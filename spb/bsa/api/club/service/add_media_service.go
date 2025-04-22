package service

import (
	mediaModel "spb/bsa/api/media/model"
	mediaUtil "spb/bsa/api/media/utility"
	tb "spb/bsa/pkg/entities"
	"spb/bsa/pkg/msg"
)

func (s *Service) AddMedia(reqBody *mediaModel.CreateMediaRequest, clubId, ownerId string) error {
	var club tb.Club
	err := s.db.Model(&tb.Club{}).Where("id = ?", clubId).First(&club).Error
	if err != nil {
		return msg.ErrClubNotFound
	}

	if club.OwnerID != ownerId {
		return msg.ErrClubWrongOwner
	}

	// Create media record
	media := mediaUtil.MapCreateRequestToEntity(reqBody)
	media.OwnerID = clubId
	media.OwnerType = string(mediaModel.OwnerTypeClub)

	if err := s.db.Create(media).Error; err != nil {
		return msg.ErrMediaCreateFailed
	}

	return nil
}
