package service

import (
	"spb/bsa/api/order/model"
	tb "spb/bsa/pkg/entities"
	"spb/bsa/pkg/entities/enum"
	"spb/bsa/pkg/payment"
)

func (s *Service) Pay(reqBody *model.PayRequest) (*payment.PaymentResponse, error) {
	var err error
	var res *payment.PaymentResponse
	// Start a transaction
	tx := s.db.Begin()
	defer func() {
		if r := recover(); r != nil {
			tx.Rollback()
		}
	}()

	// TODO: Add tax and discount calculation
	// Calculate total amount: this method for rent unit.
	totalAmount := reqBody.Amount

	// Send Payment
	paymentRequest := &payment.PaymentRequest{
		Amount:    totalAmount,
		OrderInfo: reqBody.OrderInfo,
		UserID:    reqBody.UserID,
	}

	res, err = s.gateway.CreatePayment(paymentRequest)
	if err != nil {
		tx.Rollback()
		return nil, err
	}

	// Create order
	order := &tb.Order{
		UserID:      reqBody.UserID,
		TotalAmount: totalAmount,
		Status:      enum.PENDING,
		Currency:    "VND",
		AppTranID:   res.AppTranID,
	}
	if err = tx.Create(order).Error; err != nil {
		tx.Rollback()
		return nil, err
	}

	// Create order items
	orderItem := &tb.OrderItem{
		OrderID:   order.ID,
		Price:     reqBody.Amount,
		StartTime: &reqBody.StartTime,
		EndTime:   &reqBody.EndTime,
		ItemName:  reqBody.UnitName,
		ItemID:    reqBody.UnitID,
		ItemType:  tb.OrderItemUnit,
		Quantity:  1,
	}
	if err = tx.Create(orderItem).Error; err != nil {
		tx.Rollback()
		return nil, err
	}

	// Commit the transaction
	if err = tx.Commit().Error; err != nil {
		tx.Rollback()
		return nil, err
	}
	return res, nil
}
