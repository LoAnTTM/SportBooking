package service

import (
	mediaModel "spb/bsa/api/media/model"
	"spb/bsa/api/unit/model"
	tb "spb/bsa/pkg/entities"
	"spb/bsa/pkg/global"

	"gorm.io/gorm"
)

type IService interface {
	Update(reqBody *model.UpdateUnitRequest, unitId, ownerId string) error
	GetByID(unitId string) (*tb.Unit, error)
	Delete(unitId, ownerId string) error
	Create(reqBody *model.CreateUnitRequest, ownerId string) (*tb.Unit, error)
	Search(reqBody *model.SearchUnitRequest) ([]*tb.Unit, int64, error)
	AddMedia(reqBody *mediaModel.CreateMediaRequest, clubId, ownerId string) error
	DeleteMedia(mediaId, ownerId string) error
	BookedTimeOnDay(reqBody *model.BookedTimeRequest, unitId string) ([]model.BookedTime, error)
	GetPopularity(reqBody *model.PopularityRequest) ([]*tb.Unit, error)
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
