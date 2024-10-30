package service

import (
	"spb/bsa/internal/unit_service/model"
	tb "spb/bsa/pkg/entities"
	"spb/bsa/pkg/utils"
)

// @author: LoanTT
// @function: GetAll
// @description: Service for get all unitServices
// @param: *model.GetUnitServicesRequest
// @return: []*entities.UnitService, error
func (s *Service) GetAll(reqBody *model.GetUnitServicesRequest) ([]*tb.UnitService, error) {
	var unitServices []*tb.UnitService

	err := s.db.
		Scopes(utils.Paginate(&reqBody.Pagination)).
		Where("unit_id = ?", reqBody.UnitID).
		Find(&unitServices).Error
	if err != nil {
		return nil, err
	}
	return unitServices, nil
}
