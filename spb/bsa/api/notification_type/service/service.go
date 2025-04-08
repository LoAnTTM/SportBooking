package service

import (
	tb "spb/bsa/pkg/entities"
	"spb/bsa/pkg/global"

	"gorm.io/gorm"
)

type IService interface {
	GetByType(typeVal string) (*tb.NotificationType, error)
}

type Service struct {
	db *gorm.DB
}

// @author: LoanTT
// @function: NewService
// @description: Create a new notificationType service
// @return: *Service
func NewService() *Service {
	return &Service{db: global.SPB_DB}
}
