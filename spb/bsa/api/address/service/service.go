package service

import (
	"spb/bsa/api/address/model"
	tb "spb/bsa/pkg/entities"
	"spb/bsa/pkg/global"

	"gorm.io/gorm"
)

type IService interface {
	GetProvinces() ([]*tb.Province, error)
	GetProvinceDistricts(provinceID string) ([]*tb.District, error)
	GetDistrictWards(districtID string) ([]*tb.Ward, error)
	SearchByIDs(reqBody *model.SearchByIDRequest) ([]*tb.Ward, error)
	SearchByGeography(longitude, latitude float64, radius int) ([]*model.AddressWithDistance, error)
	GetAddressByID(addressID string) (*tb.Address, error)
	GetProvinceByID(id string) (*tb.Province, error)
	GetDistrictByID(id string) (*tb.District, error)
	GetWardByID(id string) (*tb.Ward, error)
}

type Service struct {
	db *gorm.DB
}

func NewService() IService {
	return &Service{db: global.SPB_DB}
}
