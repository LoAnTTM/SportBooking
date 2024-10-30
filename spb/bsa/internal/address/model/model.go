package model

import (
	"fmt"

	"spb/bsa/internal/location/model"
	"spb/bsa/pkg/utils"
)

type GetAddressesRequest struct {
	Pagination utils.Pagination
}

type AddressResponse struct {
	AddressID         string                 `json:"address_id"`
	UnitID            string                 `json:"unit_id"`
	Address           string                 `json:"address"`
	LocationGeography LocationGeography      `json:"location_geography"`
	Location          model.LocationResponse `json:"location"`
}

type AddressesResponse struct {
	Addresses  []AddressResponse `json:"addresses"`
	Total      uint              `json:"total"`
	Pagination *utils.Pagination `json:"pagination"`
}

type LocationGeography struct {
	Longitude float64 `json:"longitude" validate:"required,gt=0,lt=180"`
	Latitude  float64 `json:"latitude" validate:"required,gt=0,lt=90"`
}

func (lg LocationGeography) GetGeography() string {
	return fmt.Sprintf("POINT(%f %f)", lg.Longitude, lg.Latitude)
}

type CreateAddressRequest struct {
	UnitID            string                `json:"unit_id" validate:"type=uuid"`
	Address           string                `json:"address" validate:"required,max=255"`
	LocationGeography LocationGeography     `json:"location_geography" validate:"required"`
	Location          model.LocationRequest `json:"location" validate:"required"`
}

type UpdateAddressRequest struct {
	UnitID            string                       `json:"unit_id" validate:"type=uuid"`
	Address           *string                      `json:"address" validate:"omitempty,max=255"`
	LocationGeography *LocationGeography           `json:"location_geography" validate:"omitempty"`
	Location          *model.UpdateLocationRequest `json:"location" validate:"omitempty"`
}
