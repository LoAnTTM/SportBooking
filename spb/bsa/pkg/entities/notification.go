package entities

import (
	"time"

	"spb/bsa/pkg/entities/enum"
)

var NotificationTN = "notification"

type Notification struct {
	Base
	Status             enum.Progress    `gorm:"type:progress" json:"status"`
	Platform           enum.Platform    `gorm:"type:platform" json:"platform"`
	Title              string           `gorm:"size:255;not null" json:"title"`
	Message            string           `gorm:"type:text" json:"message"`
	NotificationTypeID string           `gorm:"type:uuid;not null" json:"notification_type_id"`
	NotificationType   NotificationType `gorm:"foreignKey:NotificationTypeID" json:"notification_type"`
	SenderID           *string          `gorm:"type:uuid;" json:"sender_id"`
	Sender             *User            `gorm:"foreignKey:SenderID" json:"sender"`
	ReceiverID         *string          `gorm:"type:uuid;" json:"receiver_id"`
	Receiver           *User            `gorm:"foreignKey:ReceiverID" json:"receiver"`
	ReadAt             *time.Time       `json:"read_at"`
}

func (Notification) TableName() string {
	return NotificationTN
}
