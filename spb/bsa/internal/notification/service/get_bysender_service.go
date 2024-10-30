package service

import (
	"spb/bsa/internal/notification/model"
	tb "spb/bsa/pkg/entities"
	"spb/bsa/pkg/utils"
)

// @author: LoanTT
// @function: GetBySender
// @description: Get notifications by sender
// @param: reqBody *model.GetNotificationsRequest
// @return: []*tb.Notification, error
func (s *Service) GetBySender(reqBody *model.GetNotificationsRequest) ([]*tb.Notification, error) {
	var notifications []*tb.Notification

	if err := s.db.
		Scopes(utils.Paginate(&reqBody.Pagination)).
		Where("sender_id = ?", reqBody.UserID).
		Find(&notifications).Error; err != nil {
		return nil, err
	}

	return notifications, nil
}
