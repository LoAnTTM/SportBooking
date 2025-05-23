package entities

const UnitServiceTN = "unit_service"

type UnitService struct {
	Base
	Name        string `gorm:"size:255;not null" json:"name"`
	Icon        string `gorm:"size:255;" json:"icon"`
	Price       int64  `gorm:"default:0" json:"price"`
	Currency    string `gorm:"size:3;not null" json:"currency"`
	Description string `gorm:"type:text;" json:"description"`
	Status      int8   `gorm:"not null" json:"status"`
	UnitID      string `gorm:"type:uuid;not null" json:"unit_id"`
}

func (UnitService) TableName() string {
	return UnitServiceTN
}
