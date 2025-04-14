package service

import tb "spb/bsa/pkg/entities"

func (s *Service) GetByUserID(userID string) ([]*tb.Order, error) {
	var orders []*tb.Order
	if err := s.db.
		Preload("OrderItems").
		Where("user_id = ?", userID).
		Find(&orders).Error; err != nil {
		return nil, err
	}

	return orders, nil
}
