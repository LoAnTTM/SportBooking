package entities

const ProvinceTN = "province"

type Province struct {
	Base
	Name      string     `gorm:"unique;size:150;not null" json:"name"`
	NameEn    string     `gorm:"size:150;not null" json:"name_en"`
	Code      string     `gorm:"size:200;not null" json:"code"`
	Districts []District `gorm:"foreignKey:ProvinceID;references:ID" json:"districts"`
}

func (Province) TableName() string {
	return ProvinceTN
}
