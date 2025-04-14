package payment

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io"
	"net/http"

	"spb/bsa/pkg/logger"
	"spb/bsa/pkg/msg"
	"spb/bsa/pkg/utils"

	"github.com/google/uuid"
)

type MoMoGateway struct {
	PartnerCode string
	AccessKey   string
	SecretKey   string
	Endpoint    string
	NotifyURL   string
	ReturnURL   string
}

func NewMoMoGateway(partnerCode, accessKey, secretKey, endpoint, notifyURL, returnURL string) *MoMoGateway {
	return &MoMoGateway{
		PartnerCode: partnerCode,
		AccessKey:   accessKey,
		SecretKey:   secretKey,
		Endpoint:    endpoint,
		NotifyURL:   notifyURL,
		ReturnURL:   returnURL,
	}
}

func (m *MoMoGateway) CreatePayment(req *PaymentRequest) (*PaymentResponse, error) {
	logger.Infof(msg.InfoCreatePayment(req))

	orderId := uuid.New().String()
	requestId := uuid.New().String()
	amount := req.Amount

	rawSig := fmt.Sprintf(
		"accessKey=%s&amount=%d&extraData=&orderId=%s&orderInfo=%s&partnerCode=%s&redirectUrl=%s&ipnUrl=%s&requestId=%s&requestType=captureWallet",
		m.AccessKey, amount, orderId, req.OrderInfo, m.PartnerCode, m.ReturnURL, m.NotifyURL, requestId,
	)

	sig := utils.GenerateSignature(rawSig, m.SecretKey)
	body := map[string]interface{}{
		"partnerCode": m.PartnerCode,
		"accessKey":   m.AccessKey,
		"requestId":   requestId,
		"amount":      amount,
		"orderId":     orderId,
		"orderInfo":   req.OrderInfo,
		"redirectUrl": m.ReturnURL,
		"ipnUrl":      m.NotifyURL,
		"extraData":   "",
		"requestType": "captureWallet",
		"signature":   sig,
		"lang":        "vi",
	}

	jsonBody, _ := json.Marshal(body)
	res, err := http.Post(m.Endpoint, "application/json", bytes.NewReader(jsonBody))
	if err != nil {
		return nil, err
	}
	defer res.Body.Close()

	bodyResp, _ := io.ReadAll(res.Body)
	var result map[string]interface{}
	_ = json.Unmarshal(bodyResp, &result)

	return &PaymentResponse{
		PayURL: fmt.Sprintf("%v", result["payUrl"]),
	}, nil
}

func (m *MoMoGateway) HandlerCallback(body map[string]interface{}) (map[string]interface{}, error) {
	logger.Infof(msg.InfoMoMoCallback(body))

	orderId := body["orderId"].(string)
	raw, err := json.Marshal(body)
	if err != nil {
		logger.Errorf(err)
		return nil, err
	}

	return map[string]interface{}{
		"orderId": orderId,
		"raw":     string(raw),
	}, nil
}
