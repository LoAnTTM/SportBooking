package entities

import (
	"bytes"
	"text/template"
)

var NotificationTypeTN = "notification_type"

type NotificationType struct {
	Base
	Type        string `gorm:"size:255;unique;not null" json:"type"`
	Template    string `gorm:"type:text;not null" json:"template"`
	Title       string `gorm:"size:500;not null" json:"title"`
	Description string `gorm:"type:text" json:"description"`
}

func (NotificationType) TableName() string {
	return NotificationTypeTN
}

func (nt *NotificationType) MapTemplate(data interface{}) string {
	var buf bytes.Buffer
	tt := template.Must(template.New("Notification").Parse(nt.Template))
	_ = tt.Execute(&buf, data)
	return buf.String()
}
