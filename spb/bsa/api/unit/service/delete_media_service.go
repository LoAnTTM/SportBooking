package service

import (
	"fmt"

	tb "spb/bsa/pkg/entities"
)

func (s *Service) DeleteMedia(mediaId string) error {
	// Delete the media record
	if err := s.db.Where("id = ?", mediaId).Delete(&tb.Media{}).Error; err != nil {
		return fmt.Errorf("failed to delete media: %w", err)
	}

	return nil
}
