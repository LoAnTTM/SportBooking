package service

import (
	tb "spb/bsa/pkg/entities"
	"spb/bsa/pkg/global"

	"gorm.io/gorm"
)

type IService interface {
	GetAll() ([]*tb.Permission, error)
	GetByRole(roleID string) ([]tb.Permission, error)
}

type Service struct {
	db *gorm.DB
}

// @author: LoanTT
// @function: NewService
// @description: Create a new permission service
// @return: IService
func NewService() IService {
	return &Service{db: global.SPB_DB}
}
