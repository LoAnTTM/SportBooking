package model

import "time"

type PayRequest struct {
	Amount     int64     `json:"amount" validate:"required"`
	OrderInfo  string    `json:"order_info" validate:"required"`
	UserID     string    `json:"user_id" validate:"required"`
	StartTime  string    `json:"start_time" validate:"yy:mm,required"`
	EndTime    string    `json:"end_time" validate:"yy:mm,required"`
	BookingDay string    `json:"booking_day" validate:"required,datetime=2006-01-02"`
	UnitID     string    `json:"unit_id" validate:"required"`
	UnitName   string    `json:"unit_name" validate:"required"`
	Timestamp  time.Time `json:"timestamp" validate:"required"`
}

type CallBackResponse struct {
	Status string `json:"status"`
}

type ZaloPayCallbackRequest struct {
	Data string `json:"data" validate:"required"`
	Mac  string `json:"mac" validate:"required"`
	Type int    `json:"type" validate:"required"`
}

type OrderItemResponse struct {
	ID        string  `json:"id"`
	Price     int64   `json:"price"`
	StartTime *string `json:"start_time"`
	EndTime   *string `json:"end_time"`
	BookedDay *string `json:"booked_day"`
	ItemID    string  `json:"item_id"`
	ItemName  string  `json:"item_name"`
	Quantity  int     `json:"quantity"`
	ItemType  string  `json:"item_type"`
}

type OrderResponse struct {
	ID          string              `json:"id"`
	TotalAmount int64               `json:"total_amount"`
	Currency    string              `json:"currency"`
	Status      string              `json:"status"`
	OrderItems  []OrderItemResponse `json:"order_items"`
	CreatedAt   time.Time           `json:"created_at"`
}

type OrdersResponse struct {
	Orders []OrderResponse `json:"orders"`
	Total  int64           `json:"total"`
}
