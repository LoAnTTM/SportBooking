package utility

import (
	"spb/bsa/internal/address/model"
	lu "spb/bsa/internal/location/utility"
	tb "spb/bsa/pkg/entities"
)

// @author: LoanTT
// @function: MapAddressEntityToResponse
// @description: Mapping address entity to response
// @param: address tb.Address
// @return: model.AddressResponse
func MapAddressEntityToResponse(address *tb.Address) model.AddressResponse {
	longitude, latitude := address.GetGeography()
	return model.AddressResponse{
		AddressID:         address.ID,
		UnitID:            address.UnitID,
		Address:           address.Address,
		Location:          *lu.MapLocationEntityToResponse(&address.Location),
		LocationGeography: model.LocationGeography{Longitude: longitude, Latitude: latitude},
	}
}

// @author: LoanTT
// @function: MapCreateRequestToEntity
// @description: Mapping create address request to address entity
// @param: reqBody *model.CreateAddressRequest
// @return: *tb.Address
func MapCreateRequestToEntity(reqBody *model.CreateAddressRequest) *tb.Address {
	return &tb.Address{
		UnitID:            reqBody.UnitID,
		Address:           reqBody.Address,
		LocationGeography: reqBody.LocationGeography.GetGeography(),
		Location:          *lu.MapCreateRequestToEntity(&reqBody.Location),
	}
}

func MapUpdateRequestToEntity(reqBody *model.UpdateAddressRequest) tb.Address {
	return tb.Address{
		UnitID:            reqBody.UnitID,
		Address:           *reqBody.Address,
		LocationGeography: reqBody.LocationGeography.GetGeography(),
		Location:          lu.MapUpdateRequestToEntity(reqBody.Location),
	}
}
