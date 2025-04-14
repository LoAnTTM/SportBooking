package service

import (
	tb "spb/bsa/pkg/entities"
	"spb/bsa/pkg/msg"
)

func (s *Service) DeleteMedia(mediaId string) error {
	// Delete the media record
	if err := s.db.Where("id = ?", mediaId).Delete(&tb.Media{}).Error; err != nil {
		return msg.ErrDeleteFailed("media", err)
	}

	return nil
}
