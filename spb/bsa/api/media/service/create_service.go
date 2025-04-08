package service

import (
	"spb/bsa/api/media/model"
	"spb/bsa/api/media/utility"
	tb "spb/bsa/pkg/entities"

	"gorm.io/gorm"
)

func CreateMedia(tx *gorm.DB, media []*model.CreateMediaRequest, OwnerID string, OwnerType model.OwnerType) ([]*tb.Media, error) {
	mediaEntity := utility.MapCreateRequestToEntities(media)
	for i := range mediaEntity {
		mediaEntity[i].OwnerID = OwnerID
		mediaEntity[i].OwnerType = string(OwnerType)
	}

	if err := tx.Create(mediaEntity).Error; err != nil {
		tx.Rollback()
		return nil, err
	}

	return mediaEntity, nil
}
