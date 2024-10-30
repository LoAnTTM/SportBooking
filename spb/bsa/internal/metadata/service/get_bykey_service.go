package service

import tb "spb/bsa/pkg/entities"

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
		Count(&count).Error; err == nil && count == 0 {
		return nil, ErrMetadataNotFound
	} else if err != nil {
		return nil, err
	}

	err = s.db.Where("key = ?", key).First(metadata).Error
	if err != nil {
		return nil, err
	}

	return metadata, nil
}
