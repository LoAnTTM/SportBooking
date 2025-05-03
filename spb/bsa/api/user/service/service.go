package service

import (
	"spb/bsa/api/user/model"
	tb "spb/bsa/pkg/entities"
	"spb/bsa/pkg/global"

	"gorm.io/gorm"
)

type IService interface {
	Create(reqBody *model.CreateUserRequest) (*tb.User, error)
	Delete(userId string) error
	GetByEmail(email string) (*tb.User, error)
	GetByID(userId, currentUserRoleName string) (*tb.User, error)
	Update(reqBody *model.UpdateUserRequest, userId string) error
	GetAll(reqBody *model.GetUsersRequest) ([]*tb.User, int64, error)
	GetRoles(currentUserRole string) ([]tb.Role, error)
}

type Service struct {
	db *gorm.DB
}

// @author: LoanTT
// @function: NewService
// @description: Create a new user service
// @return: IService
func NewService() IService {
	return &Service{db: global.SPB_DB}
}
