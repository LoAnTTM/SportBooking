package service

import (
	"spb/bsa/api/order/domain"
	"spb/bsa/api/order/model"
	unitUtil "spb/bsa/api/unit/utility"
	tb "spb/bsa/pkg/entities"
	"spb/bsa/pkg/entities/enum"
	"spb/bsa/pkg/global"
	"spb/bsa/pkg/msg"
)

func (s *Service) ValidateStartTimeEndTime(reqBody *model.PayRequest, booking *domain.Booking) error {
	// Validate start_time and end_time inside unit open_time and close_time
	timeRangeMap := []map[string]interface{}{
		{
			"start_time": reqBody.StartTime,
			"end_time":   reqBody.EndTime,
		},
	}
	err := unitUtil.ValidateUnitPriceTime(timeRangeMap, booking.Unit.OpenTime, booking.Unit.CloseTime)
	if err != nil {
		return err
	}

	// Validate start_time start have minutes is must be multiple of env::multiple_time
	if booking.StartTime.Minute()%global.SPB_CONFIG.Order.MultipleTime != 0 {
		return msg.ErrInvalid("start_time", nil)
	}

	// Validate duration time between start_time and end_time must be multiple of env::multiple_time
	duration := booking.EndTime.Sub(booking.StartTime)
	if duration.Minutes() <= 0 || int(duration.Minutes())%global.SPB_CONFIG.Order.MultipleTime != 0 {
		return msg.ErrInvalid("start_time and end_time", nil)
	}

	// Get all unit order today and check if there is any overlap
	ordersInDay := make([]map[string]interface{}, 0)
	err = s.db.Model(&tb.Order{}).
		Joins("JOIN order_item ON order_item.order_id = \"order\".id").
		Where("\"order\".status = ? OR \"order\".status = ?", enum.PENDING, enum.SUCCESS).
		Where("order_item.item_id = ?", booking.Unit.ID).
		Where("DATE(\"order\".created_at) = ?", reqBody.Timestamp.Format("2006-01-02")).
		Select("order_item.start_time, order_item.end_time").
		Scan(&ordersInDay).Error
	if err != nil {
		return err
	}

	// Check if there is any overlap with existing orders
	for _, order := range ordersInDay {
		timeRangeMap = append(timeRangeMap, map[string]interface{}{
			"start_time": order["start_time"],
			"end_time":   order["end_time"],
		})
	}

	var timeRange []unitUtil.TimeRange
	if timeRange, err = unitUtil.MapToAscTimeRange(timeRangeMap); err != nil {
		return err
	}

	if err = unitUtil.TimeRangeOverlap(timeRange); err != nil {
		return err
	}

	return nil
}
