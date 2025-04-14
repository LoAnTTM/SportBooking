package payment

import (
	"bytes"
	"encoding/json"
	"fmt"
	"net/http"
	"time"

	"spb/bsa/pkg/logger"
	"spb/bsa/pkg/msg"
	"spb/bsa/pkg/utils"
)

type ZaloPay struct {
	AppID       int
	Key1        string
	Key2        string
	Endpoint    string
	CallbackURL string
	RedirectURL string
}

func NewZaloPay(appID int, key1, key2, endpoint, callbackUrl, redirectUrl string) *ZaloPay {
	return &ZaloPay{
		AppID:       appID,
		Key1:        key1,
		Key2:        key2,
		Endpoint:    endpoint,
		CallbackURL: callbackUrl,
		RedirectURL: redirectUrl,
	}
}

func (z *ZaloPay) CreatePayment(req *PaymentRequest) (*PaymentResponse, error) {
	appTime := time.Now().UnixMilli() + 10*60
	appTransID := fmt.Sprintf("%s_%d", time.Now().Format("060102"), appTime)
	item := "[]"
	embedData, err := utils.MapToJSONString(map[string]interface{}{"redirecturl": z.RedirectURL})
	if err != nil {
		return nil, msg.ErrMarshalFailed(err)
	}

	data := map[string]interface{}{
		"app_id":       z.AppID,
		"app_user":     "demo",
		"app_trans_id": appTransID,
		"app_time":     appTime,
		"amount":       req.Amount,
		"item":         item,
		"description":  req.OrderInfo,
		"embed_data":   embedData,
		"key1":         z.Key1,
		"callback_url": z.CallbackURL,
	}

	// Generate HMAC
	rawData := fmt.Sprintf("%d|%s|%s|%d|%d|%s|%s",
		z.AppID,
		appTransID,
		"demo",
		req.Amount,
		appTime,
		embedData,
		item,
	)
	data["mac"] = utils.HmacSHA256(rawData, z.Key1)

	// Call ZaloPay API
	body, _ := json.Marshal(data)
	resp, err := http.Post(z.Endpoint+"/v2/create", "application/json", bytes.NewBuffer(body))
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()

	var result struct {
		ReturnCode    int    `json:"return_code"`
		Message       string `json:"return_message"`
		SubReturnCode int    `json:"sub_return_code"`
		SubMessage    string `json:"sub_return_message"`
		ZpToken       string `json:"zp_trans_token"`
		OrderToken    string `json:"order_token"`
		QrCode        string `json:"qr_code"`
		OrderURL      string `json:"order_url"`
	}
	json.NewDecoder(resp.Body).Decode(&result)

	if result.ReturnCode != 1 {
		return nil, fmt.Errorf("zaloPay error: %s", result.Message)
	}

	return &PaymentResponse{
		PayURL:    result.OrderURL,
		AppTranID: appTransID,
	}, nil
}

func (z *ZaloPay) HandlerCallback(payload map[string]interface{}) (map[string]interface{}, error) {
	// Convert data(string) to data(map[string]interface{})
	var data map[string]interface{}

	if err := json.Unmarshal([]byte(payload["data"].(string)), &data); err != nil {
		return nil, msg.ErrMarshalFailed(err)
	}
	appTransID := data["app_trans_id"].(string)
	receivedMAC := payload["mac"].(string)
	status := int(payload["type"].(float64))

	mac := utils.HmacSHA256(payload["data"].(string), z.Key2)
	if mac != receivedMAC {
		return nil, msg.ErrZaloPayCallbackInvalidMac(mac, receivedMAC)
	}

	if status == 1 {
		logger.Infof(msg.InfoPaySuccess(appTransID))
	} else {
		logger.Infof(msg.InfoPayFailed(appTransID))
	}

	return data, nil
}
