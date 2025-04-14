package entities

const WardTN = "ward"

type Ward struct {
	Base
	Name       string   `gorm:"size:150;not null" json:"name"`
	NameEn     string   `gorm:"size:150;not null" json:"name_en"`
	Code       string   `gorm:"size:200;not null" json:"code"`
	DistrictID string   `gorm:"not null" json:"district_id"`
	District   District `gorm:"foreignKey:DistrictID;references:ID" json:"district"`
}

func (Ward) TableName() string {
	return WardTN
}
