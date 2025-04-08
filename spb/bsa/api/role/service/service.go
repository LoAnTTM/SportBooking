package service

import (
	tb "spb/bsa/pkg/entities"
	"spb/bsa/pkg/global"

	"gorm.io/gorm"
)

type IService interface {
	GetChildren(role any) ([]tb.Role, error)
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
