package entities

const SportTypeTN = "sport_type"

type SportType struct {
	Base
	Name string `gorm:"size:255;not null" json:"name"`
}

func (SportType) TableName() string {
	return SportTypeTN
}
