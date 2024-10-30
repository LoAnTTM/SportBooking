package entities

var MetadataTN = "metadata"

type Metadata struct {
	Base
	Key         string `gorm:"size:255;not null" json:"key"`
	Value       string `gorm:"type:text;not null" json:"value"`
	Description string `gorm:"type:text" json:"description"`
}

func (Metadata) TableName() string {
	return MetadataTN
}
