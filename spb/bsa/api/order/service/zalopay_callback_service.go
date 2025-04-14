package service

import (
	"fmt"

	"spb/bsa/api/order/model"
	tb "spb/bsa/pkg/entities"
	"spb/bsa/pkg/entities/enum"
)

func (s *Service) ZaloPayCallback(reqBody map[string]interface{}) (response *model.CallBackResponse, err error) {
	response = &model.CallBackResponse{}

	// Start a transaction
	tx := s.db.Begin()
	defer func() {
		if r := recover(); r != nil {
			tx.Rollback()
		}
	}()

	callbackRes, err := s.gateway.HandlerCallback(reqBody)
	if err != nil {
		tx.Rollback()
		return
	}

	appTransID := callbackRes["app_trans_id"].(string)
	amount := int64(callbackRes["amount"].(float64))
	status := int(reqBody["type"].(float64))
	zpTransID := fmt.Sprintf("%v", callbackRes["zp_trans_id"])

	// Lookup order by app_trans_id
	var order tb.Order
	if err = s.db.Where("app_tran_id = ?", appTransID).First(&order).Error; err != nil {
		tx.Rollback()
		return
	}

	transStatus := enum.FAILURE
	// Update order status
	if status == 1 {
		transStatus = enum.SUCCESS
	}

	if err = s.db.Model(&order).Update("status", transStatus).Error; err != nil {
		tx.Rollback()
		return
	}

	response.Status = string(transStatus)
	// Log the transaction
	transaction := tb.Transaction{
		OrderID:         order.ID,
		Provider:        "zalopay",
		ProviderTransID: zpTransID,
		Amount:          amount,
		Status:          response.Status,
		RawData:         callbackRes,
	}
	if err = s.db.Create(&transaction).Error; err != nil {
		tx.Rollback()
		return
	}

	if err = tx.Commit().Error; err != nil {
		tx.Rollback()
		return
	}
	return
}
