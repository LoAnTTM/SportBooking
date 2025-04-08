package service

import (
	"spb/bsa/pkg/global"

	"gorm.io/gorm"
)

type IService interface{}

type Service struct {
	db *gorm.DB
}

// @author: LoanTT
// @function: NewService
// @description: Create a new order service
// @return: IService
func NewService() IService {
	return &Service{db: global.SPB_DB}
}
