package service

import (
	tb "spb/bsa/pkg/entities"
)

// @author: LoanTT
// @function: GetByID
// @description: Service for get club
// @param: clubId string, currentClubRoleName string
// @return: *tb.Club, error
func (s *Service) GetByID(clubId, currentClubRoleName string) (*tb.Club, error) {
	club := new(tb.Club)

	err := s.db.Where("id = ?", clubId).First(club).Error
	if err != nil {
		return nil, err
	}

	return club, nil
}
