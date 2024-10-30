package service

import (
	"spb/bsa/internal/notification/model"
	tb "spb/bsa/pkg/entities"
	"spb/bsa/pkg/utils"
)

// @author: LoanTT
// @function: GetByReceiver
// @description: Service for get notifications by receiver
// @param: notificationId string, currentNotificationRoleName string
// @return: []*tb.Notification, error
func (s *Service) GetByReceiver(reqBody *model.GetNotificationsRequest) ([]*tb.Notification, error) {
	var notifications []*tb.Notification

	if err := s.db.
		Scopes(utils.Paginate(&reqBody.Pagination)).
		Where("receiver_id = ?", reqBody.UserID).
		Find(&notifications).Error; err != nil {
		return nil, err
	}

	return notifications, nil
}
