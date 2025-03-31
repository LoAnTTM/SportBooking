package service

import (
	"spb/bsa/api/club/model"
	"spb/bsa/api/club/utility"
	tb "spb/bsa/pkg/entities"
)

// @author: LoanTT
// @function: Create
// @description: Service for club creation
// @param: club model.CreateClubRequest
// @return: club entities.Club, error
func (s *Service) Create(reqBody *model.CreateClubRequest) (*tb.Club, error) {
	club := utility.MapCreateRequestToEntity(reqBody)
	if err := s.db.Create(club).Error; err != nil {
		return nil, err
	}

	return club, nil
}
