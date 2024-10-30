package service

import (
	"errors"

	"spb/bsa/internal/user/model"
	"spb/bsa/internal/user/utility"
	tb "spb/bsa/pkg/entities"
	"spb/bsa/pkg/utils"
)

var ErrEmailExists = errors.New("email already exists")

// @author: LoanTT
// @function: Create
// @description: Service for user creation
// @param: user model.CreateUserRequest
// @return: user entities.User, error
func (s *Service) Create(reqBody *model.CreateUserRequest) (*tb.User, error) {
	var count int64

	err := s.db.Model(&tb.User{}).Scopes(utility.EmailIsVerity).Where("email = ?", reqBody.Email).Count(&count).Error
	if count > 0 || err != nil {
		return nil, ErrEmailExists
	}

	var role *tb.Role
	if err := s.db.
		Preload("Permissions").
		Where("id = ?", reqBody.Role).
		First(role).Error; err != nil {
		return nil, err
	}

	user := mapCreateRequestToEntity(reqBody, role)
	if err := s.db.Create(&user).Error; err != nil {
		return nil, err
	}

	return user, nil
}

// @author: LoanTT
// @function: mapCreateRequestToEntity
// @description: Mapping create user request to user entity
// @param: reqBody model.CreateUserRequest
// @param: role tb.Role
// @return: *tb.User
func mapCreateRequestToEntity(reqBody *model.CreateUserRequest, role *tb.Role) *tb.User {
	return &tb.User{
		Email:           reqBody.Email,
		Password:        utils.BcryptHash(reqBody.Password),
		Role:            *role,
		RoleID:          role.ID,
		IsEmailVerified: false,
	}
}
