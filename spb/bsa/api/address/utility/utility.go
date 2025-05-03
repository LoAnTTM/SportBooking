package utility

import (
	"strings"

	"spb/bsa/api/address/model"
	tb "spb/bsa/pkg/entities"
)

func GeoJSONToPoint(p tb.GeoPoint) model.Point {
	return model.Point{
		Longitude: p.Coordinates[0],
		Latitude:  p.Coordinates[1],
	}
}

func DoubleFloatToPoint(coordinates []float64) model.Point {
	return model.Point{
		Longitude: coordinates[0],
		Latitude:  coordinates[1],
	}
}

func PointToDoubleFloat(p model.Point) [2]float64 {
	return [2]float64{p.Longitude, p.Latitude}
}

// @author: LoanTT
// @function: MapAddressEntityToResponse
// @description: Mapping address entity to response
// @param: address tb.Address
// @return: model.AddressResponse
func MapAddressEntityToResponse(address *tb.Address) *model.AddressResponse {
	return &model.AddressResponse{
		AddressID:         address.ID,
		Address:           address.Address,
		LocationGeography: GeoJSONToPoint(address.LocationGeography),
		Ward:              address.Ward.Name,
		WardCode:          address.Ward.Code,
		District:          address.Ward.District.Name,
		DistrictCode:      address.Ward.District.Code,
		Province:          address.Ward.District.Province.Name,
		ProvinceCode:      address.Ward.District.Province.Code,
	}
}

// @author: LoanTT
// @function: MapCreateRequestToEntity
// @description: Mapping create address request to address entity
// @param: reqBody *model.CreateAddressRequest
// @return: *tb.Address
func MapCreateRequestToEntity(reqBody *model.CreateAddressRequest) *tb.Address {
	return &tb.Address{
		Address:           reqBody.Address,
		LocationGeography: tb.GeoPoint{Type: "Point", Coordinates: PointToDoubleFloat(reqBody.LocationGeography)},
		WardID:            reqBody.WardID,
	}
}

func MapUpdateRequestToEntity(reqBody *model.UpdateAddressRequest) map[string]interface{} {
	updates := make(map[string]interface{})

	if trimmed := strings.TrimSpace(reqBody.Address); trimmed != "" {
		updates["address"] = trimmed
	}
	if reqBody.LocationGeography != nil {
		updates["location_geography"] = tb.GeoPoint{Type: "Point", Coordinates: PointToDoubleFloat(*reqBody.LocationGeography)}
	}
	if trimmed := strings.TrimSpace(reqBody.WardID); trimmed != "" {
		updates["ward_id"] = trimmed
	}

	return updates
}

func MapWardEntitiesToIDs(ward []*tb.Ward) []string {
	wards := make([]string, len(ward))

	for id := range ward {
		wards[id] = ward[id].ID
	}

	return wards
}

func MapProvinceEntitiesToResponse(provinces []*tb.Province) []*model.LocationResponse {
	provinceResponses := make([]*model.LocationResponse, len(provinces))

	for i, province := range provinces {
		provinceResponses[i] = MapProvinceEntityToResponse(province)
	}

	return provinceResponses
}

func MapDistrictEntitiesToResponse(districts []*tb.District) []*model.LocationResponse {
	districtResponses := make([]*model.LocationResponse, len(districts))

	for i, district := range districts {
		districtResponses[i] = MapDistrictEntityToResponse(district)
	}

	return districtResponses
}

func MapWardEntitiesToResponse(wards []*tb.Ward) []*model.LocationResponse {
	wardResponses := make([]*model.LocationResponse, len(wards))

	for i, ward := range wards {
		wardResponses[i] = MapWardEntityToResponse(ward)
	}

	return wardResponses
}

func MapProvinceEntityToResponse(province *tb.Province) *model.LocationResponse {
	return &model.LocationResponse{
		ID:     province.ID,
		Name:   province.Name,
		NameEn: province.NameEn,
		Code:   province.Code,
	}
}

func MapDistrictEntityToResponse(district *tb.District) *model.LocationResponse {
	return &model.LocationResponse{
		ID:     district.ID,
		Name:   district.Name,
		NameEn: district.NameEn,
		Code:   district.Code,
	}
}

func MapWardEntityToResponse(ward *tb.Ward) *model.LocationResponse {
	return &model.LocationResponse{
		ID:     ward.ID,
		Name:   ward.Name,
		NameEn: ward.NameEn,
		Code:   ward.Code,
	}
}

func MapAddressEntitiesToIDs(addresses []*model.AddressWithDistance) []string {
	addressIDs := make([]string, len(addresses))

	for id := range addresses {
		addressIDs[id] = addresses[id].ID
	}

	return addressIDs
}
