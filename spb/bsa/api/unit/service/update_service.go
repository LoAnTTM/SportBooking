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
func (s *Service) Update(reqBody *model.UpdateUnitRequest, unitId string) error {
	var count int64

	// check if unit exists
	if err := s.db.Model(tb.Unit{}).
		Where("id = ?", unitId).
		Count(&count).Error; err != nil {
		return err
	}
	if count == 0 {
		return msg.ErrUnitNotFound
	}

	tx := s.db.Begin()
	defer func() {
		if r := recover(); r != nil {
			tx.Rollback()
		}
	}()

	// update unit
	unitUpdate := utility.MapUpdateRequestToEntity(reqBody)
	if len(unitUpdate) > 0 {
		if err := s.db.Model(tb.Unit{}).
			Where("id = ?", unitId).
			Updates(unitUpdate).Error; err != nil {
			return err
		}
	}

	// Update unit's address
	unitEntity := new(tb.Unit)
	if err := tx.Preload("SportTypes").
		Where("id = ?", unitId).
		First(unitEntity).Error; err != nil {
		tx.Rollback()
		return fmt.Errorf("failed to get unit's address: %w", err)
	}
	if reqBody.Address != nil {
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
		return fmt.Errorf("failed to delete existing unit prices: %w", err)
	}

	// Create new unit prices
	newUnitPrices := upUtil.MapUpdateRequestToEntities(reqBody)
	for i := range newUnitPrices {
		newUnitPrices[i].UnitID = unitId
	}

	if err := tx.Create(&newUnitPrices).Error; err != nil {
		tx.Rollback()
		return fmt.Errorf("failed to create new unit prices: %w", err)
	}

	return nil
}

func UpdateUnitServices(tx *gorm.DB, unitId string, reqBody []usModel.UpdateUnitServiceRequest) error {
	// Delete existing unit services
	if err := tx.Where("unit_id = ?", unitId).Delete(&tb.UnitService{}).Error; err != nil {
		tx.Rollback()
		return fmt.Errorf("failed to delete existing unit services: %w", err)
	}

	// Create new unit services
	newUnitServices := usUtil.MapUpdateRequestToEntities(reqBody)
	for i := range newUnitServices {
		newUnitServices[i].UnitID = unitId
	}

	if err := tx.Create(&newUnitServices).Error; err != nil {
		tx.Rollback()
		return fmt.Errorf("failed to create new unit services: %w", err)
	}

	return nil
}
