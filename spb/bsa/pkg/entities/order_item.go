package entities

const (
	OrderItemTN          = "order_item"
	OrderItemUnit        = "unit"
	OrderItemUnitService = "unit_service"
)

type OrderItem struct {
	Base
	OrderID    string  `gorm:"type:uuid;not null" json:"order_id"`
	Price      int64   `gorm:"default:0" json:"price"`
	StartTime  *string `gorm:"size:5" json:"start_time"`
	EndTime    *string `gorm:"size:5" json:"end_time"`
	BookingDay *string `gorm:"size:10;not null" json:"booking_day"`
	ItemID     string  `gorm:"type:uuid;not null" json:"item_id"`
	ItemName   string  `gorm:"size:255;not null" json:"item_name"`
	Quantity   int     `gorm:"not null" json:"quantity"`
	ItemType   string  `gorm:"size:20;not null" json:"item_type"`
}

func (OrderItem) TableName() string {
	return OrderItemTN
}
