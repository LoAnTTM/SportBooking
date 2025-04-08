package service

import (
	"spb/bsa/api/address"
	tb "spb/bsa/pkg/entities"
	"spb/bsa/pkg/msg"
)

// @author: LoanTT
// @function: GetByID
// @description: Service for get club
// @param: clubId string string
// @return: *tb.Club, error
func (s *Service) GetByID(clubId string) (*tb.Club, error) {
	club := new(tb.Club)

	err := s.db.Model(&tb.Club{}).
		Preload("Owner").
		Preload("Media").
		Preload("SportTypes").
		Where("club.id = ?", clubId).First(club).Error
	if err != nil {
		return nil, msg.ErrClubNotFound
	}

	club.Address, err = address.AddressService.GetAddressByID(club.AddressID)
	if err != nil {
		return nil, msg.ErrAddressNotFound
	}

	return club, nil
}
