package service

import (
	"spb/bsa/api/notification/model"
	tb "spb/bsa/pkg/entities"
	"spb/bsa/pkg/entities/enum"
	"spb/bsa/pkg/global"

	"gorm.io/gorm"
)

type IService interface {
	Create(reqBody *model.CreateNotificationRequest, tx *gorm.DB) (*tb.Notification, error)
	GetByReceiver(reqBody *model.GetNotificationsRequest) ([]*tb.Notification, int64, error)
	GetBySender(reqBody *model.GetNotificationsRequest) ([]*tb.Notification, int64, error)
	UpdateStatus(senderID string, status enum.Progress) error
}

type Service struct {
	db *gorm.DB
}

// @author: LoanTT
// @function: NewService
// @description: Create a new notification service
// @return: IService
func NewService() IService {
	return &Service{db: global.SPB_DB}
}
