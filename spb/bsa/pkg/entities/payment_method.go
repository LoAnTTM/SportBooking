package entities

var PaymentMethodTN = "payment_method"

type PaymentMethod struct {
	Base
	MethodType int8   `json:"method_type"`
	ProviderID string `gorm:"type:text" json:"provider_id"`
	IsDefault  bool   `gorm:"default:false" json:"is_default"`
}

func (PaymentMethod) TableName() string {
	return PaymentMethodTN
}
