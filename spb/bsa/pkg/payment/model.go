package payment

type PaymentRequest struct {
	UserID    string `json:"user_id"`
	Amount    int64  `json:"amount"`
	OrderInfo string `json:"order_info"`
}

type PaymentResponse struct {
	PayURL    string `json:"pay_url"`
	AppTranID string `json:"app_tran_id"`
}
