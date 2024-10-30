package utility

import (
	"spb/bsa/internal/location/model"
	tb "spb/bsa/pkg/entities"
	"spb/bsa/pkg/utils"
)

// @author: LoanTT
// @function: MapLocationEntitiesToResponse
// @description: Map locations entity to response
// @param: locations []*tb.Location
// @return: model.LocationsResponse
func MapLocationEntitiesToResponse(location []*tb.Location) model.LocationsResponse {
	locations := make([]*model.LocationResponse, len(location))

	for id := range location {
		locations[id] = MapLocationEntityToResponse(location[id])
	}
	return model.LocationsResponse{
		Locations: locations,
		Total:     uint(len(location)),
	}
}

// @author: LoanTT
// @function: MapLocationEntityToResponse
// @description: Map location entity to response
// @param: location *tb.Location
// @return: *model.LocationResponse
func MapLocationEntityToResponse(location *tb.Location) *model.LocationResponse {
	return &model.LocationResponse{
		LocationID:   location.ID,
		Province:     location.Province,
		City:         location.City,
		District:     location.District,
		Description:  location.Description,
		ProvinceSlug: location.ProvinceSlug,
		CitySlug:     location.CitySlug,
		DistrictSlug: location.DistrictSlug,
	}
}

// @author: LoanTT
// @function: MapCreateRequestToEntities
// @description: Mapping create location request to location entity
// @param: reqBody model.CreateLocationRequest
// @return: []*tb.Location
func MapCreateRequestToEntities(reqBody *model.CreateLocationRequest) []*tb.Location {
	locations := make([]*tb.Location, len(reqBody.Locations))

	for _, location := range reqBody.Locations {
		locations = append(locations, &tb.Location{
			Province:     location.Province,
			ProvinceSlug: utils.CreateSlug(location.Province),
			City:         location.City,
			CitySlug:     utils.CreateSlug(location.City),
			District:     location.District,
			DistrictSlug: utils.CreateSlug(location.District),
			Description:  location.Description,
		})
	}
	return locations
}

// @author: LoanTT
// @function: MapCreateRequestToEntity
// @description: Mapping create location request to location entity
// @param: reqBody model.LocationRequest
// @return: *tb.Location
func MapCreateRequestToEntity(reqBody *model.LocationRequest) *tb.Location {
	return &tb.Location{
		Province:     reqBody.Province,
		ProvinceSlug: utils.CreateSlug(reqBody.Province),
		City:         reqBody.City,
		CitySlug:     utils.CreateSlug(reqBody.City),
		District:     reqBody.District,
		DistrictSlug: utils.CreateSlug(reqBody.District),
		Description:  reqBody.Description,
	}
}

// @author: LoanTT
// @function: MapUpdateRequestToEntity
// @description: mapping update fields
// @param: reqBody *model.UpdateLocationRequest
// @return: tb.Location
func MapUpdateRequestToEntity(reqBody *model.UpdateLocationRequest) tb.Location {
	var locationUpdate tb.Location

	if reqBody.Province != nil {
		locationUpdate.Province = *reqBody.Province
		locationUpdate.ProvinceSlug = utils.CreateSlug(*reqBody.Province)
	}
	if reqBody.City != nil {
		locationUpdate.City = *reqBody.City
		locationUpdate.CitySlug = utils.CreateSlug(*reqBody.City)
	}
	if reqBody.District != nil {
		locationUpdate.District = *reqBody.District
		locationUpdate.DistrictSlug = utils.CreateSlug(*reqBody.District)
	}
	if reqBody.Description != nil {
		locationUpdate.Description = *reqBody.Description
	}
	return locationUpdate
}
