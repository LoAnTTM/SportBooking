package service

import (
	roleModule "spb/bsa/internal/role"
	roleUtility "spb/bsa/internal/role/utility"
	"spb/bsa/internal/user/model"
	"spb/bsa/internal/user/utility"
	tb "spb/bsa/pkg/entities"
	"spb/bsa/pkg/msg"
	"spb/bsa/pkg/utils"
)

// @author: LoanTT
// @function: GetAll
// @description: Service for get all users
// @param: *model.GetUsersRequest
// @return: []*entities.User, error
func (s *Service) GetAll(reqBody *model.GetUsersRequest) ([]*tb.User, error) {
	var users []*tb.User

	childrenRoles, err := roleModule.RoleService.GetChildren(reqBody.Role)
	if err != nil {
		return nil, err
	}
	roles := roleUtility.FlattenAndGetRoleIds(childrenRoles)
	if len(roles) == 0 {
		return nil, msg.ErrPermission
	}

	err = s.db.
		Scopes(utility.SatisfiedUser(roles), utils.Paginate(&reqBody.Pagination)).
		Preload("Role").
		Find(&users).Error
	if err != nil {
		return nil, err
	}

	return users, nil
}
