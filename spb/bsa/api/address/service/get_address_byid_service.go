package service

import (
	tb "spb/bsa/pkg/entities"
)

func (s Service) GetAddressByID(addressID string) (*tb.Address, error) {
	var err error

	// Get address
	addressRecord := new(tb.Address)
	err = s.db.Model(&tb.Address{}).
		Select("id, address, ward_id, ST_AsGeoJSON(location_geography) as location_geography").
		Where("id = ?", addressID).
		Scan(addressRecord).Error
	if err != nil {
		return nil, err
	}

	// Get address location
	addressRecord.Ward = tb.Ward{}
	err = s.db.Model(&tb.Ward{}).
		Preload("District.Province").
		Where("id = ?", addressRecord.WardID).First(&addressRecord.Ward).Error
	if err != nil {
		return nil, err
	}
	return addressRecord, nil
}
