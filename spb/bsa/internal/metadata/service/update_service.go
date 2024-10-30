package service

import (
	"errors"
	"spb/bsa/internal/metadata/model"
	"spb/bsa/internal/metadata/utility"

	tb "spb/bsa/pkg/entities"

	"gorm.io/gorm/clause"
)

var ErrMetadataNotFound = errors.New("metadata not found")

// @author: LoanTT
// @function: Update
// @description: Service for metadata update
// @param: metadata model.UpdateMetadataRequest
// @param: string metadata id
// @return: metadata entities.Metadata, error
func (s *Service) Update(reqBody *model.UpdateMetadataRequest) (*tb.Metadata, error) {
	var err error
	var count int64
	var metadatas []tb.Metadata

	// check if metadata exists
	if err = s.db.Model(tb.Metadata{}).
		Where("key = ?", reqBody.Key).
		Count(&count).Error; err == nil && count == 0 {
		return nil, ErrMetadataNotFound
	} else if err != nil {
		return nil, err
	}

	metadataUpdate := utility.MapUpdateRequestToEntity(reqBody)
	// update metadata
	err = s.db.Model(&metadatas).
		Clauses(clause.Returning{}).
		Where("key = ?", reqBody.Key).
		Updates(metadataUpdate).Error
	if err != nil {
		return nil, err
	}
	if len(metadatas) == 0 {
		return nil, ErrMetadataNotFound
	}

	return &metadatas[0], nil
}
