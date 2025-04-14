package entities

const UnitPriceTN = "unit_price"

type UnitPrice struct {
	Base
	Price     int64  `gorm:"default:0" json:"price"`
	Currency  string `gorm:"size:3;not null" json:"currency"`
	UnitID    string `gorm:"type:uuid;not null" json:"unit_id"`
	StartTime string `gorm:"size:5;not null" json:"start_time"`
	EndTime   string `gorm:"size:5;not null" json:"end_time"`
}

func (UnitPrice) TableName() string {
	return UnitPriceTN
}
