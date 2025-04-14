package service

import (
	"spb/bsa/api/auth/model"
	"spb/bsa/api/auth/utility"
	pModule "spb/bsa/api/permission"
	tb "spb/bsa/pkg/entities"
	"spb/bsa/pkg/msg"
	"spb/bsa/pkg/utils"
)

// @author: LoanTT
// @function: AccountLogin
// @description: User login with email and password
// @param: user model.UserDTO
// @return: user entities.User, error
func (s *Service) AccountLogin(u *model.LoginRequest) (*tb.User, error) {
	var user tb.User

	err := s.db.
		Scopes(utility.EmailIsVerity).
		Where("email = ?", u.Email).
		Preload("Role").
		First(&user).Error
	if err != nil {
		return nil, err
	}

	if ok := utils.BcryptCheck(u.Password, user.Password); !ok {
		return nil, msg.ErrIncorrectPassword
	}

	var permissions []tb.Permission
	permissions, err = pModule.PermissionService.GetByRole(user.Role.ID)
	if err != nil {
		return nil, err
	}

	user.Role.Permissions = permissions
	return &user, nil
}
