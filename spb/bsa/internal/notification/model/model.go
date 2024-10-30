package model

import (
	"time"

	"spb/bsa/pkg/entities/enum"
	"spb/bsa/pkg/utils"
)

type GetNotificationsRequest struct {
	Pagination utils.Pagination
	UserID     string
}

type NotificationResponse struct {
	NotificationID     string  `json:"notification_id"`
	Status             string  `json:"status"`
	Platform           string  `json:"platform"`
	Title              string  `json:"title"`
	Message            string  `json:"message"`
	NotificationTypeID string  `json:"notification_type_id"`
	Sender             string  `json:"sender"`
	Receiver           string  `json:"receiver"`
	ReadAt             *uint64 `json:"read_at,omitempty"`
}

type NotificationsResponse struct {
	Notifications []NotificationResponse `json:"notifications"`
	Total         uint                   `json:"total"`
	Pagination    *utils.Pagination      `json:"pagination"`
}

type CreateNotificationRequest struct {
	ID               string        `json:"id"`
	Status           enum.Progress `json:"status"`
	Platform         enum.Platform `json:"platform"`
	Title            string        `json:"title"`
	Message          string        `json:"message"`
	NotificationType string        `json:"notification_type"`
	SenderID         *string       `json:"sender_id,omitempty"`
	ReceiverID       *string       `json:"receiver_id,omitempty"`
	ReadAt           *time.Time    `json:"read_at,omitempty"`
}
