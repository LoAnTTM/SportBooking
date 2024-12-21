package service

import (
	"spb/bsa/api/metadata/model"
	"spb/bsa/api/metadata/utility"

	tb "spb/bsa/pkg/entities"
	"spb/bsa/pkg/msg"

	"gorm.io/gorm/clause"
)

// @author: LoanTT
// @function: Update
// @description: Service for metadata update
// @param: metadata model.UpdateMetadataRequest
// @param: string metadata id
// @return: metadata entities.Metadata, error
func (s *Service) Update(key string, reqBody *model.UpdateMetadataRequest) (*tb.Metadata, error) {
	var err error
	var count int64
	var metadatas []tb.Metadata

	// check if metadata exists
	if err = s.db.Model(tb.Metadata{}).
		Where("key = ?", key).
		Count(&count).Error; err == nil && count == 0 {
		return nil, msg.ErrMetadataNotFound
	} else if err != nil {
		return nil, err
	}

	metadataUpdate := utility.MapUpdateRequestToEntity(reqBody)
	// update metadata
	err = s.db.Model(&metadatas).
		Clauses(clause.Returning{}).
		Where("key = ?", key).
		Updates(metadataUpdate).Error
	if err != nil {
		return nil, err
	}
	if len(metadatas) == 0 {
		return nil, msg.ErrUpdateMetadataFailed
	}

	return &metadatas[0], nil
}
