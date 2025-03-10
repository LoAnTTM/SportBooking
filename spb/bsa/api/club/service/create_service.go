package service

import (
	"spb/bsa/api/club/model"
	tb "spb/bsa/pkg/entities"
)

// @author: LoanTT
// @function: Create
// @description: Service for club creation
// @param: club model.CreateClubRequest
// @return: club entities.Club, error
func (s *Service) Create(reqBody *model.CreateClubRequest) (*tb.Club, error) {
	return nil, nil
}
