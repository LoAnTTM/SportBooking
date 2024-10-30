package entities

var UnitPriceTN = "unit_price"

type UnitPrice struct {
	Base
	Price     float32 `gorm:"type:decimal(12,2);" json:"price"`
	UnitID    string  `gorm:"type:uuid;not null" json:"unit_id"`
	StartTime string  `gorm:"size:5;not null" json:"start_time"`
	EndTime   string  `gorm:"size:5;not null" json:"end_time"`
}

func (UnitPrice) TableName() string {
	return UnitPriceTN
}
