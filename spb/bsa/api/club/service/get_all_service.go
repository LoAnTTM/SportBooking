package service

import (
	"spb/bsa/api/address"
	"spb/bsa/api/club/model"
	tb "spb/bsa/pkg/entities"
	"spb/bsa/pkg/msg"
	"spb/bsa/pkg/utils"
)

// @author: LoanTT
// @function: GetAll
// @description: Service for get all clubs
// @param: reqBody model.GetClubsRequest
// @return: []*tb.Club, int64, error
func (s *Service) GetAll(reqBody *model.GetClubsRequest) ([]*tb.Club, int64, error) {
	var count int64
	clubs := make([]*tb.Club, 0)

	err := s.db.Model(&tb.Club{}).
		Preload("Media").
		Preload("SportTypes").
		Scopes(utils.Paginate(&reqBody.Pagination)).
		Find(&clubs).Error
	if err != nil {
		return nil, count, err
	}

	// Get address
	for i := 0; i < len(clubs); i++ {
		addressRecord, err := address.AddressService.GetAddressByID(clubs[i].AddressID)
		if err != nil {
			return nil, count, msg.ErrAddressNotFound
		}
		clubs[i].Address = addressRecord
	}

	// Get count
	err = s.db.Model(&tb.Club{}).
		Count(&count).Error
	if err != nil {
		return nil, count, err
	}
	return clubs, count, nil
}
