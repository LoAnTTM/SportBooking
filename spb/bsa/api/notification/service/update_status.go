package service

import (
	tb "spb/bsa/pkg/entities"
	"spb/bsa/pkg/entities/enum"
)

// @author: LoanTT
// @function: UpdateStatus
// @description: Update notification status
// @param: receiverId string, status enum.Progress
// @return: error
func (s *Service) UpdateStatus(receiverId string, status enum.Progress) error {
	notify := new(tb.Notification)
	err := s.db.Where("receiver_id = ?", receiverId).First(notify).Error
	if err != nil {
		return err
	}

	notify.Status = status
	if err := s.db.Save(&notify).Error; err != nil {
		return err
	}
	return nil
}
