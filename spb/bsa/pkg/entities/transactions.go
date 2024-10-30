package entities

var TransactionsTN = "transactions"

type Transactions struct {
	Base
	TransactionStatus string   `gorm:"size:20;not null" json:"transaction_status"`
	Amount            float32  `gorm:"type:decimal(12,2);" json:"amount"`
	Currency          string   `gorm:"size:10;not null;" json:"currency"`
	ResponseCode      string   `gorm:"size:20" json:"response_code"`
	ResponseMessage   string   `gorm:"type:text" json:"response_message"`
	GatewayID         string   `gorm:"size:255" json:"gateway_id"`
	PaymentsID        string   `gorm:"type:uuid;not null" json:"payments_id"`
	Payments          Payments `gorm:"foreignKey:PaymentsID" json:"payments"`
}

func (Transactions) TableName() string {
	return TransactionsTN
}
