package entities

import "time"

var WebHooksTN = "webhooks"

type WebHook struct {
	Base
	EventType  string    `gorm:"size:20;not null" json:"event_type"`
	Payload    string    `gorm:"type:text" json:"payload"`
	Processed  bool      `gorm:"default:false" json:"processed"`
	ReceivedAt time.Time `gorm:"not null" json:"received_at"`
}

func (WebHook) TableName() string {
	return WebHooksTN
}
