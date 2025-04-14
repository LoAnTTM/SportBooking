package service

import (
	"spb/bsa/api/metadata/model"
	tb "spb/bsa/pkg/entities"
	"spb/bsa/pkg/global"

	"gorm.io/gorm"
)

type IService interface {
	GetByKey(key string) (*tb.Metadata, error)
	Update(key string, reqBody *model.UpdateMetadataRequest) error
}

type Service struct {
	db *gorm.DB
}

// @author: LoanTT
// @function: NewService
// @description: Create a new metadata service
// @return: IService
func NewService() IService {
	return &Service{db: global.SPB_DB}
}
