package service

import (
	"spb/bsa/api/club/model"
	tb "spb/bsa/pkg/entities"
)

// @author: LoanTT
// @function: Update
// @description: Service for club update
// @param: club model.UpdateClubRequest
// @param: string club id
// @return: club entities.Club, error
func (s *Service) Update(reqBody *model.UpdateClubRequest, clubId string) (*tb.Club, error) {
	return nil, nil
}
