package service

import (
	"spb/bsa/api/order/domain"
	"spb/bsa/api/order/model"
	"spb/bsa/api/order/utility"
	tb "spb/bsa/pkg/entities"
	"spb/bsa/pkg/entities/enum"
	"spb/bsa/pkg/msg"
	"spb/bsa/pkg/payment"
)

func (s *Service) Pay(reqBody *model.PayRequest) (*payment.PaymentResponse, error) {
	var err error
	var res *payment.PaymentResponse

	// Get unit + unit price
	unit := new(tb.Unit)
	err = s.db.Model(&tb.Unit{}).
		Preload("UnitPrice").
		Preload("UnitService").
		Where("id = ?", reqBody.UnitID).First(unit).Error
	if err != nil {
		return nil, err
	}

	var booking *domain.Booking
	booking, err = utility.MapPayRequestToBooking(reqBody, unit)
	if err != nil {
		return nil, err
	}

	if err = s.ValidateStartTimeEndTime(reqBody, booking); err != nil {
		return nil, err
	}

	timeRanges, err := s.priceCalculator.CalculateTimeRanges(booking)
	if err != nil {
		return nil, err
	}

	// TODO: Add tax and discount calculation
	totalAmount := CalculateTotalAmount(timeRanges)
	if totalAmount != reqBody.Amount {
		return nil, msg.ErrPaymentAmountInvalid
	}

	paymentRequest := &payment.PaymentRequest{
		Amount:    totalAmount,
		OrderInfo: reqBody.OrderInfo,
		UserID:    reqBody.UserID,
	}

	tx := s.db.Begin()
	defer func() {
		if r := recover(); r != nil {
			tx.Rollback()
		}
	}()

	res, err = s.gateway.CreatePayment(paymentRequest)
	if err != nil {
		tx.Rollback()
		return nil, err
	}

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

	orderItem := &tb.OrderItem{
		OrderID:    order.ID,
		Price:      reqBody.Amount,
		StartTime:  &reqBody.StartTime,
		EndTime:    &reqBody.EndTime,
		BookingDay: &reqBody.BookingDay,
		ItemName:   reqBody.UnitName,
		ItemID:     reqBody.UnitID,
		ItemType:   tb.OrderItemUnit,
		Quantity:   1,
	}
	if err = tx.Create(orderItem).Error; err != nil {
		tx.Rollback()
		return nil, err
	}

	if err = tx.Commit().Error; err != nil {
		tx.Rollback()
		return nil, err
	}
	return res, nil
}

func CalculateTotalAmount(timeRanges []domain.TimeRange) int64 {
	bookingFee := CalculateBookingFee(timeRanges)
	return bookingFee
}

func CalculateBookingFee(timeRanges []domain.TimeRange) int64 {
	var bookingFee int64

	// unit price (calculate from start_time and end_time)
	for _, timeRange := range timeRanges {
		bookingFee += timeRange.Amount
	}

	return bookingFee
}
