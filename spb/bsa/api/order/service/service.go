package service

import (
	"spb/bsa/api/order/model"
	tb "spb/bsa/pkg/entities"
	"spb/bsa/pkg/global"
	"spb/bsa/pkg/payment"

	"gorm.io/gorm"
)

type IService interface {
	Pay(reqBody *model.PayRequest) (*payment.PaymentResponse, error)
	ZaloPayCallback(reqBody map[string]interface{}) (*model.CallBackResponse, error)
	GetByUserID(userID string) ([]*tb.Order, error)
}

type Service struct {
	db      *gorm.DB
	gateway payment.PaymentGateway
}

// @author: LoanTT
// @function: NewService
// @description: Create a new order service
// @return: IService
func NewService() IService {
	// Initialize payment gateway
	zaloGateway := payment.NewZaloPay(
		global.SPB_CONFIG.Payment.ZaloPay.AppID,
		global.SPB_CONFIG.Payment.ZaloPay.Key1,
		global.SPB_CONFIG.Payment.ZaloPay.Key2,
		global.SPB_CONFIG.Payment.ZaloPay.Endpoint,
		global.SPB_CONFIG.Payment.ZaloPay.CallbackURL,
		global.SPB_CONFIG.Payment.ZaloPay.RedirectURL,
	)
	return &Service{db: global.SPB_DB, gateway: zaloGateway}
}
