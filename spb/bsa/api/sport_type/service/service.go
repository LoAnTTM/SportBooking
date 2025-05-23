package service

import (
	"spb/bsa/api/sport_type/model"
	tb "spb/bsa/pkg/entities"
	"spb/bsa/pkg/global"

	"gorm.io/gorm"
)

type IService interface {
	CheckManyExist(ids []string) (bool, error)
	Create(reqBody *model.CreateSportTypeRequest) (*tb.SportType, error)
	Delete(sportTypeId string) error
	GetAll() ([]*tb.SportType, error)
	GetByID(sportTypeId string) (*tb.SportType, error)
	Update(reqBody *model.UpdateSportTypeRequest, sportTypeId string) error
}

type Service struct {
	db *gorm.DB
}

// @author: LoanTT
// @function: NewService
// @description: Create a new sportType service
// @return: IService
func NewService() IService {
	return &Service{db: global.SPB_DB}
}
