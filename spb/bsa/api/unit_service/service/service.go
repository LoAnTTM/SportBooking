package service

import (
	"spb/bsa/api/unit_service/model"
	tb "spb/bsa/pkg/entities"
	"spb/bsa/pkg/global"

	"gorm.io/gorm"
)

type IService interface {
	Create(reqBody *model.CreateUnitServiceRequest) (*tb.UnitService, error)
	Delete(unitServiceId string) error
	GetAll(reqBody *model.GetUnitServicesRequest) ([]*tb.UnitService, error)
	GetByID(unitServiceId string) (*tb.UnitService, error)
	Update(reqBody *model.UpdateUnitServiceRequest, unitServiceId string) (*tb.UnitService, error)
}

type Service struct {
	db *gorm.DB
}

// @author: LoanTT
// @function: NewService
// @description: Create a new unit_service service
// @return: IService
func NewService() IService {
	return &Service{db: global.SPB_DB}
}
