package service

import (
	"spb/bsa/api/notification/model"
	tb "spb/bsa/pkg/entities"
	"spb/bsa/pkg/utils"
)

// @author: LoanTT
// @function: GetByReceiver
// @description: Service for get notifications by receiver
// @param: notificationId string, currentNotificationRoleName string
// @return: []*tb.Notification, error
func (s *Service) GetByReceiver(reqBody *model.GetNotificationsRequest) ([]*tb.Notification, int64, error) {
	var notifications []*tb.Notification
	var count int64

	if err := s.db.
		Scopes(utils.Paginate(&reqBody.Pagination)).
		Where("receiver_id = ?", reqBody.UserID).
		Find(&notifications).Error; err != nil {
		return nil, 0, err
	}

	// Get total count of notifications
	if err := s.db.Model(&tb.Notification{}).
		Where("receiver_id = ?", reqBody.UserID).
		Count(&count).Error; err != nil {
		return nil, 0, err
	}
	return notifications, count, nil
}
