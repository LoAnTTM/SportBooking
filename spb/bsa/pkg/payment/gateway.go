package payment

type PaymentGateway interface {
	CreatePayment(req *PaymentRequest) (*PaymentResponse, error)
	HandlerCallback(body map[string]interface{}) (map[string]interface{}, error)
}
