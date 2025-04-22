package service

import (
	"spb/bsa/api/unit/model"
	"spb/bsa/pkg/entities"
	"spb/bsa/pkg/entities/enum"
	"spb/bsa/pkg/msg"
)

func (s *Service) BookedTimeOnDay(reqBody *model.BookedTimeRequest, unitId string) ([]model.BookedTime, error) {
	// Convert timestamp to date
	var bookedTimeMap []model.BookedTime
	var unit entities.Unit

	err := s.db.Model(&entities.Unit{}).
		Where("id = ?", unitId).First(&unit).Error
	if err != nil {
		return nil, msg.ErrUnitNotFound
	}

	err = s.db.Model(&entities.Order{}).
		Joins("JOIN order_item ON \"order\".id = order_item.order_id").
		Where("order_item.item_type = ?", entities.OrderItemUnit).
		Where("order_item.item_id = ? AND order_item.booking_day = ?", unitId, reqBody.BookedDay).
		Where("\"order\".status = ?", enum.SUCCESS).
		Select("order_item.start_time, order_item.end_time").
		Scan(&bookedTimeMap).Error
	if err != nil {
		return nil, err
	}

	return bookedTimeMap, nil
}
