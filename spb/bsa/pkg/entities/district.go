package entities

const DistrictTN = "district"

type District struct {
	Base
	Name       string   `gorm:"index:,unique,composite:district_unique;size:150;not null" json:"name"`
	NameEn     string   `gorm:"size:150;not null" json:"name_en"`
	Code       string   `gorm:"size:200;not null" json:"code"`
	ProvinceID string   `gorm:"index:,unique,composite:district_unique;not null" json:"province_id"`
	Province   Province `gorm:"foreignKey:ProvinceID;references:ID" json:"province"`
	Wards      []Ward   `gorm:"foreignKey:DistrictID;references:ID" json:"wards"`
}

func (District) TableName() string {
	return DistrictTN
}
