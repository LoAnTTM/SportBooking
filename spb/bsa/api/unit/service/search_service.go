package service

import (
	address "spb/bsa/api/address"
	am "spb/bsa/api/address/model"
	au "spb/bsa/api/address/utility"
	"spb/bsa/api/unit/model"
	tb "spb/bsa/pkg/entities"
	"spb/bsa/pkg/logger"
	"spb/bsa/pkg/msg"
	"spb/bsa/pkg/utils"
)

// @author: LoanTT
// @function: Search
// @description: Service for search unit
// @param: reqBody *model.SearchUnitRequest
// @return: []*tb.Unit, int64, error
func (s *Service) Search(reqBody *model.SearchUnitRequest) ([]*tb.Unit, int64, error) {
	var err error
	units := make([]*tb.Unit, 0)

	query := s.db.
		Preload("UnitPrice").
		Preload("UnitService").
		Preload("Media").
		Preload("SportTypes")

	// search by location
	if IsSearchByLocation(reqBody) {
		requestLocation := am.NewSearchLocationRequest(reqBody.Pagination.Province, reqBody.Pagination.District, reqBody.Pagination.Ward)
		wards, err := address.AddressService.SearchByIDs(requestLocation)
		if err != nil {
			logger.Errorf("Error when searching location: %v", err)
			return nil, 0, err
		}

		wardIds := au.MapWardEntitiesToIDs(wards)
		query = query.Where("address_id IN (SELECT id from address WHERE ward_id IN ?)", wardIds)
	}

	if IsSearchByGeography(reqBody) {
		// search by geography
		addresses, err := address.AddressService.SearchByGeography(reqBody.Pagination.Longitude, reqBody.Pagination.Latitude, reqBody.Pagination.Radius)
		if err != nil {
			logger.Errorf("Error when searching geography: %v", err)
			return nil, 0, err
		}
		addressIds := au.MapAddressEntitiesToIDs(addresses)
		query = query.Where("address_id IN ?", addressIds)
	}

	// get by sport type
	if IsSearchBySportType(reqBody) {
		query = query.Where("sport_type_id = ?", reqBody.Pagination.SportType)
	}

	// get by unit name or club name
	if IsSearchByQuery(reqBody) {
		query = query.Where("name LIKE ?", "%"+reqBody.Pagination.Query+"%")
	}

	err = query.
		Scopes(utils.Paginate(&reqBody.Pagination.Pagination)).
		Find(&units).Error
	if err != nil {
		logger.Errorf("Error when searching unit: %v", err)
		return nil, 0, err
	}

	// Get address
	for i := 0; i < len(units); i++ {
		units[i].Address, err = address.AddressService.GetAddressByID(units[i].AddressID)
		if err != nil {
			return nil, 0, msg.ErrAddressNotFound
		}
	}

	// count total unit
	var count int64
	err = s.db.Model(tb.Unit{}).Count(&count).Error
	if err != nil {
		logger.Errorf("Error when counting unit: %v", err)
		return nil, 0, err
	}

	return units, count, nil
}

func IsSearchByLocation(reqBody *model.SearchUnitRequest) bool {
	return reqBody.Pagination.Province != "" || reqBody.Pagination.Ward != "" || reqBody.Pagination.District != ""
}

func IsSearchByQuery(reqBody *model.SearchUnitRequest) bool {
	return reqBody.Pagination.Query != ""
}

func IsSearchBySportType(reqBody *model.SearchUnitRequest) bool {
	return reqBody.Pagination.SportType != ""
}

func IsSearchByGeography(reqBody *model.SearchUnitRequest) bool {
	return reqBody.Pagination.Latitude != 0 || reqBody.Pagination.Longitude != 0
}
