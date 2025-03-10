package service

import (
	"spb/bsa/api/club/model"
	tb "spb/bsa/pkg/entities"
	"spb/bsa/pkg/global"

	"gorm.io/gorm"
)

type IService interface {
	Update(reqBody *model.UpdateClubRequest, clubId string) (*tb.Club, error)
	GetByID(clubId, currentClubRoleName string) (*tb.Club, error)
	Delete(clubId string) error
	Create(reqBody *model.CreateClubRequest) (*tb.Club, error)
}

type Service struct {
	db *gorm.DB
}

// @author: LoanTT
// @function: NewService
// @description: Create a new club service
// @return: *Service
func NewService() IService {
	return &Service{db: global.SPB_DB}
}
