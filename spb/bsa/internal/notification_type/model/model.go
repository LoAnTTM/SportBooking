package model

type NotificationTypeResponse struct {
	NotificationTypeID string `json:"notification_type_id"`
	Type               string `json:"type"`
	Template           string `json:"template"`
	Title              string `json:"title"`
	Description        string `json:"description"`
}
