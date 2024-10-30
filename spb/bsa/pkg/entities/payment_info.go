package entities

const PaymentInfoCTN = "payment_info"

type PaymentInfo struct {
	Base
	QRcode   string `gorm:"type:text;not null" json:"qrcode"`
	UserName string `gorm:"type:text;not null" json:"username"`
	BankName string `gorm:"type:text;not null" json:"bankname"`
}

func (PaymentInfo) TableName() string {
	return PaymentInfoCTN
}
