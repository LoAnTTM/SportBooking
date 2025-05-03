package service

import (
	"sort"

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
	var addressDistances []*am.AddressWithDistance
	units := make([]*tb.Unit, 0)

	baseQuery := s.db.Model(&tb.Unit{})
	// search by location
	if IsSearchByLocation(reqBody) {
		requestLocation := am.NewSearchLocationRequest(reqBody.Pagination.Province, reqBody.Pagination.District, reqBody.Pagination.Ward)
		wards, err := address.AddressService.SearchByIDs(requestLocation)
		if err != nil {
			return nil, 0, err
		}

		wardIds := au.MapWardEntitiesToIDs(wards)
		baseQuery = baseQuery.Where("address_id IN (SELECT id from address WHERE ward_id IN ?)", wardIds)
	}

	if IsSearchByGeography(reqBody) {
		// search by geography
		addressDistances, err = address.AddressService.SearchByGeography(reqBody.Pagination.Longitude, reqBody.Pagination.Latitude, reqBody.Pagination.Radius)
		if err != nil {
			return nil, 0, err
		}
		addressIds := au.MapAddressEntitiesToIDs(addressDistances)
		baseQuery = baseQuery.Where("address_id IN ?", addressIds)
	}

	// get by sport type
	if IsSearchBySportType(reqBody) {
		baseQuery = baseQuery.Where("id IN (SELECT us.unit_id FROM unit_sporttype us WHERE us.sport_type_id = ?)", reqBody.Pagination.SportType)
	}

	// search by unit name and description
	//  TODO: can search by address
	if IsSearchByQuery(reqBody) {
		baseQuery = baseQuery.
			Where("SIMILARITY(unit.keywords, ?) > 0.1", reqBody.Pagination.Query)
	}

	// count total unit
	var count int64
	if err = baseQuery.Count(&count).Error; err != nil {
		return nil, 0, err
	}

	dataQuery := baseQuery.
		Preload("UnitPrice").
		Preload("UnitService").
		Preload("Media").
		Preload("SportTypes")

	err = dataQuery.
		Scopes(utils.Paginate(&reqBody.Pagination.Pagination)).
		Find(&units).Error
	if err != nil {
		logger.Errorf(msg.ErrGetFailed("Unit", err))
		return nil, 0, err
	}

	// Get address
	for i := 0; i < len(units); i++ {
		units[i].Address, err = address.AddressService.GetAddressByID(units[i].AddressID)
		if err != nil {
			return nil, 0, msg.ErrNotFound("Address")
		}
	}

	// Sort units by address distance
	if IsSearchByGeography(reqBody) {
		units = SortUnitsByDistance(units, addressDistances)
	}

	return units, count, nil
}

func SortUnitsByDistance(units []*tb.Unit, addressDistances []*am.AddressWithDistance) []*tb.Unit {
	// If either units or addressDistances is empty, return units as is
	if len(units) == 0 || len(addressDistances) == 0 {
		return units
	}

	// Create a map of address ID to distance for quick lookup
	addressDistanceMap := make(map[string]float64)
	for _, addr := range addressDistances {
		addressDistanceMap[addr.ID] = addr.Distance
	}

	// Create a copy of units to avoid modifying the original slice
	sortedUnits := make([]*tb.Unit, len(units))
	copy(sortedUnits, units)

	// Sort units by their address distance
	sort.Slice(sortedUnits, func(i, j int) bool {
		// Get distances for both units
		distanceI, existsI := addressDistanceMap[sortedUnits[i].AddressID]
		distanceJ, existsJ := addressDistanceMap[sortedUnits[j].AddressID]

		// If both addresses exist in the map, compare their distances
		if existsI && existsJ {
			return distanceI < distanceJ
		}

		// If only one exists, prioritize the one with distance information
		return existsI && !existsJ
	})

	return sortedUnits
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
