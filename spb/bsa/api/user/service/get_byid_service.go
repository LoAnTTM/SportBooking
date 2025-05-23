package service

import (
	roleModule "spb/bsa/api/role"
	roleUtility "spb/bsa/api/role/utility"
	"spb/bsa/api/user/utility"
	tb "spb/bsa/pkg/entities"
	"spb/bsa/pkg/msg"
)

// @author: LoanTT
// @function: GetByID
// @description: Service for get user
// @param: userId string, currentUserRoleName string
// @return: *tb.User, error
func (s *Service) GetByID(userId, currentUserRoleName string) (*tb.User, error) {
	var err error
	user := new(tb.User)

	err = s.db.Scopes(utility.EmailIsVerity).
		Preload("Role.Permissions").
		Where("id = ?", userId).First(user).Error
	if err != nil {
		return nil, err
	}

	childrenRoles, err := roleModule.RoleService.GetChildren(currentUserRoleName)
	if err != nil {
		return nil, err
	}

	roles := roleUtility.FlattenAndGetRoleNames(childrenRoles)
	if len(roles) == 0 {
		return nil, msg.ErrPermission
	}

	for _, roleName := range roles {
		if roleName == user.Role.Name {
			return user, nil
		}
	}

	return user, nil
}
