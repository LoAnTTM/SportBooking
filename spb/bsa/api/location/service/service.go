package service

import (
	"spb/bsa/api/location/model"
	tb "spb/bsa/pkg/entities"
	"spb/bsa/pkg/global"

	"gorm.io/gorm"
)

type IService interface {
	Update(reqBody *model.UpdateLocationRequest, locationId string) (*tb.Location, error)
	GetAll(reqBody *model.GetLocationsRequest) ([]*tb.Location, int64, error)
	Delete(locationId string) error
	Create(reqBody *model.CreateLocationRequest) ([]*tb.Location, error)
	Search(reqBody *model.SearchLocationRequest) ([]*tb.Location, error)
}

type Service struct {
	db *gorm.DB
}

// @author: LoanTT
// @function: NewService
// @description: Create a new location service
// @return: *Service
func NewService() IService {
	return &Service{db: global.SPB_DB}
}
