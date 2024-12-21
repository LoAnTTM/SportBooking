package service

import (
	"spb/bsa/pkg/global"

	"gorm.io/gorm"
)

type Service struct {
	db *gorm.DB
}

// @author: LoanTT
// @function: NewService
// @description: Create a new notification service
// @return: *Service
func NewService() *Service {
	return &Service{db: global.SPB_DB}
}
