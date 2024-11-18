package service

import (
	"spb/bsa/internal/notification/model"
	"spb/bsa/internal/notification/utility"
	tb "spb/bsa/pkg/entities"

	"gorm.io/gorm"
)

// @author: LoanTT
// @function: Create
// @description: Service for notification creation
// @param: reqBody *model.CreateNotificationRequest
// @return: *tb.Notification, error
func (s *Service) Create(reqBody *model.CreateNotificationRequest, tx *gorm.DB) (*tb.Notification, error) {
	notifyType := new(tb.NotificationType)
	if err := tx.
		Where("type = ?", reqBody.NotificationType).
		First(notifyType).Error; err != nil {
		return nil, err
	}

	notification := utility.MapCreateRequestToEntity(reqBody, notifyType)
	if err := tx.Create(&notification).Error; err != nil {
		return nil, err
	}

	return notification, nil
}
