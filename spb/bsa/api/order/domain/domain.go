package domain

import (
	"time"

	tb "spb/bsa/pkg/entities"
	"spb/bsa/pkg/msg"
)

type Booking struct {
	Unit      *tb.Unit
	StartTime time.Time
	EndTime   time.Time
	UserID    string
	Amount    int64
	OrderInfo string
}

type TimeRange struct {
	StartTime time.Time
	EndTime   time.Time
	Price     int64
	Amount    int64
}

func (tr *TimeRange) CalculateAmount() {
	duration := tr.EndTime.Sub(tr.StartTime).Minutes()
	tr.Amount = int64(float64(tr.Price) * duration / 60)
}

func (tr *TimeRange) Validate() error {
	if tr.StartTime.After(tr.EndTime) {
		return msg.ErrInvalidTimeRange
	}
	if tr.Price < 0 {
		return msg.ErrInvalidPrice
	}
	return nil
}
