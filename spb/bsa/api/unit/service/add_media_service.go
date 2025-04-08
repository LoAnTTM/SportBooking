package service

import (
	"fmt"

	mediaModel "spb/bsa/api/media/model"
	mediaUtil "spb/bsa/api/media/utility"
	tb "spb/bsa/pkg/entities"
	"spb/bsa/pkg/msg"
)

func (s *Service) AddMedia(unitId string, reqBody *mediaModel.CreateMediaRequest) error {
	// Check if club exists
	var count int64
	err := s.db.Model(&tb.Unit{}).Where("id = ?", unitId).Count(&count).Error
	if err != nil {
		return err
	}
	if count == 0 {
		return msg.ErrUnitNotFound
	}

	// Create media record
	media := mediaUtil.MapCreateRequestToEntity(reqBody)
	media.OwnerID = unitId
	media.OwnerType = string(mediaModel.OwnerTypeUnit)

	if err := s.db.Create(media).Error; err != nil {
		return fmt.Errorf("failed to create media: %w", err)
	}

	return nil
}
