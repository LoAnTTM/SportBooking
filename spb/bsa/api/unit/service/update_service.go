package service

import (
	"fmt"

	addressModel "spb/bsa/api/address/model"
	addressUtil "spb/bsa/api/address/utility"
	"spb/bsa/api/unit/model"
	"spb/bsa/api/unit/utility"
	upModel "spb/bsa/api/unit_price/model"
	upUtil "spb/bsa/api/unit_price/utility"
	usModel "spb/bsa/api/unit_service/model"
	usUtil "spb/bsa/api/unit_service/utility"
	tb "spb/bsa/pkg/entities"
	"spb/bsa/pkg/msg"

	"gorm.io/gorm"
)

// @author: LoanTT
// @function: Update
// @description: Service for unit update
// @param: unit model.UpdateUnitRequest
// @param: string unit id
// @return: unit entities.Unit, error
func (s *Service) Update(reqBody *model.UpdateUnitRequest, unitId, ownerId string) error {
	// Check if club exists
	var club tb.Club
	err := s.db.Model(&tb.Club{}).
		Joins("JOIN unit ON unit.club_id = club.id").
		Where("unit.id = ?", unitId).First(&club).Error
	if err != nil {
		return msg.ErrUnitNotFound
	}
	if club.OwnerID != ownerId {
		return msg.ErrUnitWrongOwner
	}

	tx := s.db.Begin()
	defer func() {
		if r := recover(); r != nil {
			tx.Rollback()
		}
	}()

	unitEntity := new(tb.Unit)
	if err := tx.Preload("SportTypes").
		Where("id = ?", unitId).
		First(unitEntity).Error; err != nil {
		tx.Rollback()
		return fmt.Errorf("failed to get unit: %w", err)
	}
	unitUpdate := utility.MapUpdateRequestToEntity(reqBody)
	// Make new keywords
	unitName := unitEntity.Name
	if val, ok := unitUpdate["name"]; !ok {
		unitName = val.(string)
	}
	unitDescription := unitEntity.Description
	if val, ok := unitUpdate["description"]; !ok {
		unitDescription = val.(string)
	}
	keywords := utility.MakeKeyword(unitName, unitDescription)
	unitUpdate["keywords"] = keywords

	// Update unit's address
	if reqBody.Address != nil {
		// Update address
		if err := UpdateUnitAddress(tx, unitEntity.AddressID, reqBody.Address); err != nil {
			return err
		}
	}

	// Update unit's sport types
	if reqBody.SportTypes != nil {
		if err := UpdateUnitSportTypes(tx, unitEntity, reqBody.SportTypes); err != nil {
			return err
		}
	}

	// Update unit's price
	if reqBody.UnitPrices != nil {
		if err := UpdateUnitPrice(tx, unitId, reqBody.UnitPrices); err != nil {
			return err
		}
	}

	// Update unit's services
	if reqBody.UnitServices != nil {
		if err := UpdateUnitServices(tx, unitId, reqBody.UnitServices); err != nil {
			return err
		}
	}

	// update unit
	if len(unitUpdate) > 0 {
		if err := s.db.Model(tb.Unit{}).
			Where("id = ?", unitId).
			Updates(unitUpdate).Error; err != nil {
			return err
		}
	}

	if err := tx.Commit().Error; err != nil {
		tx.Rollback()
		return err
	}

	return nil
}

func UpdateUnitAddress(tx *gorm.DB, addressID string, address *addressModel.UpdateAddressRequest) error {
	newAddress := addressUtil.MapUpdateRequestToEntity(address)

	if err := tx.Model(&tb.Address{Base: tb.Base{ID: addressID}}).
		Updates(newAddress).Error; err != nil {
		tx.Rollback()
		return err
	}

	return nil
}

func UpdateUnitSportTypes(tx *gorm.DB, unit *tb.Unit, sportTypeIDs []string) error {
	var newSportTypes []tb.SportType
	if len(sportTypeIDs) > 0 {
		if err := tx.Where("id IN ?", sportTypeIDs).Find(&newSportTypes).Error; err != nil {
			tx.Rollback()
			return err
		}
	}

	// Replace associations
	if err := tx.Model(unit).Association("SportTypes").Replace(&newSportTypes); err != nil {
		tx.Rollback()
		return err
	}

	return nil
}

func UpdateUnitPrice(tx *gorm.DB, unitId string, reqBody []upModel.UpdateUnitPriceRequest) error {
	// Delete existing unit prices
	if err := tx.Where("unit_id = ?", unitId).Delete(&tb.UnitPrice{}).Error; err != nil {
		tx.Rollback()
		return msg.ErrDeleteFailed("UnitPrice", err)
	}

	// Create new unit prices
	newUnitPrices := upUtil.MapUpdateRequestToEntities(reqBody)
	for i := range newUnitPrices {
		newUnitPrices[i].UnitID = unitId
	}

	if err := tx.Create(&newUnitPrices).Error; err != nil {
		tx.Rollback()
		return msg.ErrCreateFailed("UnitPrice", err)
	}

	return nil
}

func UpdateUnitServices(tx *gorm.DB, unitId string, reqBody []usModel.UpdateUnitServiceRequest) error {
	// Delete existing unit services
	if err := tx.Where("unit_id = ?", unitId).Delete(&tb.UnitService{}).Error; err != nil {
		tx.Rollback()
		return msg.ErrDeleteFailed("UnitService", err)
	}

	// Create new unit services
	newUnitServices := usUtil.MapUpdateRequestToEntities(reqBody)
	for i := range newUnitServices {
		newUnitServices[i].UnitID = unitId
	}

	if err := tx.Create(&newUnitServices).Error; err != nil {
		tx.Rollback()
		return msg.ErrCreateFailed("UnitService", err)
	}

	return nil
}
