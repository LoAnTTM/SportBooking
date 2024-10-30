package entities

var PaymentsTN = "payments"

type Payments struct {
	Base
	Amount          float32       `gorm:"type:decimal(12,2);" json:"amount"`
	PaymentStatus   int8          `gorm:"not null;" json:"payment_status"`
	Currency        string        `gorm:"size:10;not null;" json:"currency"`
	PaymentMethodID string        `gorm:"type:uuid;not null;" json:"payment_method_id"`
	PaymentMethod   PaymentMethod `gorm:"foreignKey:PaymentMethodID" json:"payment_method"`
	OrderID         string        `gorm:"type:uuid;not null;" json:"order_id"`
	Order           Order         `gorm:"foreignKey:OrderID" json:"order"`
	UserID          string        `gorm:"type:uuid;not null;" json:"user_id"`
	User            User          `gorm:"foreignKey:UserID" json:"user"`
}

func (Payments) TableName() string {
	return PaymentsTN
}
