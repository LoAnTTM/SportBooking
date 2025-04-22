package service

import (
	tb "spb/bsa/pkg/entities"
	"spb/bsa/pkg/msg"
)

func (s *Service) DeleteMedia(mediaId, ownerId string) error {
	unit := new(tb.Unit)
	if err := s.db.Model(&tb.Unit{}).
		Joins("JOIN club ON unit.club_id = club.id").
		Joins("JOIN media ON unit.id = media.owner_id").
		Where("media.id = ? AND club.owner_id = ?", mediaId, ownerId).
		First(&unit).Error; err != nil {
		return msg.ErrUnitWrongOwner
	}

	// Delete the media record
	if err := s.db.Where("id = ?", mediaId).Delete(&tb.Media{}).Error; err != nil {
		return msg.ErrDeleteFailed("Media", err)
	}

	return nil
}
