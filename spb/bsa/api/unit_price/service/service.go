package service

import (
	"spb/bsa/api/unit_price/model"
	tb "spb/bsa/pkg/entities"
	"spb/bsa/pkg/global"

	"gorm.io/gorm"
)

type IService interface {
	Create(reqBody *model.CreateUnitPriceRequest) (*tb.UnitPrice, error)
	Delete(unitPriceId string) error
	GetAll(reqBody *model.GetUnitPricesRequest) ([]*tb.UnitPrice, error)
	GetByID(unitPriceId string) (*tb.UnitPrice, error)
	Update(reqBody *model.UpdateUnitPriceRequest, unitPriceId string) (*tb.UnitPrice, error)
}

type Service struct {
	db *gorm.DB
}

// @author: LoanTT
// @function: NewService
// @description: Create a new unitPrice service
// @return: IService
func NewService() IService {
	return &Service{db: global.SPB_DB}
}
