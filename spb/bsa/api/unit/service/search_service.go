package service

import (
	location "spb/bsa/api/location"
	locationModel "spb/bsa/api/location/model"
	locationUtility "spb/bsa/api/location/utility"
	"spb/bsa/api/unit/model"
	tb "spb/bsa/pkg/entities"
	"spb/bsa/pkg/logger"
	"spb/bsa/pkg/utils"
)

// @author: LoanTT
// @function: Search
// @description: Service for search unit
// @param: reqBody *model.SearchUnitRequest
// @return: []*tb.Unit, int64, error
func (s *Service) Search(reqBody *model.SearchUnitRequest) ([]*tb.Unit, int64, error) {
	var locations []*tb.Location
	var err error
	units := make([]*tb.Unit, 0)

	query := s.db.
		Preload("Address").
		Preload("UnitPrice").
		Preload("UnitService").
		Preload("Media").
		Preload("SportTypes")

	// search by location
	if IsSearchByLocation(reqBody) {
		requestLocation := locationModel.NewSearchLocationRequest(reqBody.Pagination.Province, reqBody.Pagination.City, reqBody.Pagination.District)
		locations, err = location.LocationService.Search(requestLocation)
		if err != nil {
			logger.Errorf("Error when searching location: %v", err)
			return nil, 0, err
		}

		locationIds := locationUtility.MapLocationEntitiesToIDs(locations)
		query = query.Where("location_id IN (?)", locationIds)
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
	return reqBody.Pagination.Province != "" || reqBody.Pagination.City != "" || reqBody.Pagination.District != ""
}

func IsSearchByQuery(reqBody *model.SearchUnitRequest) bool {
	return reqBody.Pagination.Query != ""
}

func IsSearchBySportType(reqBody *model.SearchUnitRequest) bool {
	return reqBody.Pagination.SportType != ""
}
