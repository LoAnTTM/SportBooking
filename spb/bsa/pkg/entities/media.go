package entities

const MediaTN = "media"

type Media struct {
	Base
	FilePath  string `gorm:"size:255;not null" json:"file_path"`
	FileType  string `gorm:"size:255;not null" json:"file_type"`
	Hash      string `gorm:"size:255;not null" json:"hash"`
	OwnerID   string `gorm:"type:uuid;not null" json:"owner_id"`
	OwnerType string `gorm:"size:50;not null" json:"owner_type"`
}

func (Media) TableName() string {
	return MediaTN
}
