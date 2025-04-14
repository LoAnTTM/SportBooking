package entities

const TransactionTN = "transaction"

type Transaction struct {
	Base
	OrderID         string                 `gorm:"type:uuid" json:"order_id"`
	Order           Order                  `gorm:"foreignKey:OrderID"`
	Amount          int64                  `gorm:"default:0" json:"amount"`
	RawData         map[string]interface{} `gorm:"type:jsonb" json:"response_body"`
	Provider        string                 `gorm:"size:20" json:"provider"`
	ProviderTransID string                 `gorm:"size:255" json:"provider_trans_id"`
	Status          string                 `gorm:"size:10" json:"status"`
}

func (Transaction) TableName() string {
	return TransactionTN
}
