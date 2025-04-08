package service

import (
	mediaModel "spb/bsa/api/media/model"
	"spb/bsa/api/unit/model"
	tb "spb/bsa/pkg/entities"
	"spb/bsa/pkg/global"

	"gorm.io/gorm"
)

type IService interface {
	Update(reqBody *model.UpdateUnitRequest, unitId string) error
	GetByID(unitId string) (*tb.Unit, error)
	Delete(unitId string) error
	Create(reqBody *model.CreateUnitRequest) (*tb.Unit, error)
	Search(reqBody *model.SearchUnitRequest) ([]*tb.Unit, int64, error)
	AddMedia(clubId string, reqBody *mediaModel.CreateMediaRequest) error
	DeleteMedia(mediaId string) error
}

type Service struct {
	db *gorm.DB
}

// @author: LoanTT
// @function: NewService
// @description: Create a new unit service
// @return: *Service
func NewService() IService {
	return &Service{db: global.SPB_DB}
}
