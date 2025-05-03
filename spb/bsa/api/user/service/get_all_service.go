package service

import (
	"spb/bsa/api/user/model"
	"spb/bsa/api/user/utility"
	tb "spb/bsa/pkg/entities"
	"spb/bsa/pkg/utils"
)

// @author: LoanTT
// @function: GetAll
// @description: Service for get all users
// @param: pagination utils.Pagination
// @return: []*tb.User, int64, error
func (s *Service) GetAll(reqBody *model.GetUsersRequest) ([]*tb.User, int64, error) {
	var count int64
	users := make([]*tb.User, 0)

	query := s.db.Model(&tb.User{}).
		Scopes(utility.EmailIsVerity).
		Preload("Role.Permissions").
		Count(&count)

	if reqBody.Pagination.Role != "" {
		query = query.Where("role_id = ?", reqBody.Pagination.Role)
	}

	err := query.
		Scopes(utils.Paginate(&reqBody.Pagination.Pagination)).
		Find(&users).Error
	if err != nil {
		return nil, 0, err
	}

	return users, count, nil
}
