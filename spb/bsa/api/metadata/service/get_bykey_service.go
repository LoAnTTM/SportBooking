package service

import (
	tb "spb/bsa/pkg/entities"
	"spb/bsa/pkg/msg"
)

// @author: LoanTT
// @function: GetByKey
// @description: Service for get metadata by key
// @param: key string
// @return: metadata *tb.Metadata, error
func (s *Service) GetByKey(key string) (*tb.Metadata, error) {
	var err error
	var count int64
	metadata := new(tb.Metadata)

	// check if metadata exists
	if err = s.db.Model(tb.Metadata{}).
		Where("key = ?", key).
		Count(&count).Error; err != nil {
		return nil, err
	}

	if count == 0 {
		return nil, msg.ErrNotFound("metadata")
	}

	err = s.db.Where("key = ?", key).First(metadata).Error
	if err != nil {
		return nil, err
	}

	return metadata, nil
}
