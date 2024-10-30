package entities

import "time"

var MediaTN = "media"

type Media struct {
	Base
	FilePath   string    `gorm:"size:255;not null" json:"file_path"`
	FileType   string    `gorm:"size:255;not null" json:"file_type"`
	Hash       string    `gorm:"size:255;not null" json:"hash"`
	UploadedAt time.Time `gorm:"not null" json:"uploaded_at"`
}

func (Media) TableName() string {
	return MediaTN
}
