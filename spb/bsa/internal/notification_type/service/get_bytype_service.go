package service

import (
	tb "spb/bsa/pkg/entities"
)

// @author: LoanTT
// @function: GetByType
// @description: get notification type by type
// @param: type string
// @return: *tb.NotificationType, error
func (s *Service) GetByType(typeVal string) (*tb.NotificationType, error) {
	notificationType := new(tb.NotificationType)

	err := s.db.Where("type = ?", typeVal).First(notificationType).Error
	if err != nil {
		return nil, err
	}

	return notificationType, nil
}
