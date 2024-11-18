package service

import (
	"spb/bsa/internal/location/model"
	"spb/bsa/internal/location/utility"
	tb "spb/bsa/pkg/entities"
	"spb/bsa/pkg/msg"

	"gorm.io/gorm/clause"
)

// @author: LoanTT
// @function: Update
// @description: Service for location update
// @param: location model.UpdateLocationRequest
// @param: string location id
// @return: location entities.Location, error
func (s *Service) Update(reqBody *model.UpdateLocationRequest, locationId string) (*tb.Location, error) {
	var err error
	var count int64
	var locations []tb.Location

	// check if location exists
	if err = s.db.Model(tb.Location{}).
		Where("id = ?", locationId).
		Count(&count).Error; err == nil && count == 0 {
		return nil, msg.ErrLocationNotFound
	} else if err != nil {
		return nil, err
	}

	locationUpdate := utility.MapUpdateRequestToEntity(reqBody)
	// update location
	err = s.db.Model(&locations).
		Clauses(clause.Returning{}).
		Where("id = ?", locationId).
		Preload("Role.Permissions").
		Updates(locationUpdate).Error
	if err != nil {
		return nil, err
	}
	if len(locations) == 0 {
		return nil, msg.ErrLocationNotFound
	}

	return &locations[0], nil
}
