package model

import (
	"spb/bsa/pkg/entities"
	"spb/bsa/pkg/utils"
)

type Point struct {
	Longitude float64 `json:"longitude" validate:"required"`
	Latitude  float64 `json:"latitude" validate:"required"`
}

type SearchByIDRequest struct {
	WardID     string `json:"ward_id" validate:"omitempty,max=255"`
	DistrictID string `json:"district_id" validate:"omitempty,max=255"`
	ProvinceID string `json:"province_id" validate:"omitempty,max=255"`
}

type CreateAddressRequest struct {
	Address           string `json:"address" validate:"required,max=255"`
	LocationGeography Point  `json:"location_geography"`
	WardID            string `json:"ward_id" validate:"required"`
}

type UpdateAddressRequest struct {
	Address           string `json:"address" validate:"omitempty,max=255"`
	LocationGeography *Point `json:"location_geography" validate:"omitempty"`
	WardID            string `json:"ward_id" validate:"omitempty"`
}

type AddressResponse struct {
	AddressID         string `json:"address_id"`
	Address           string `json:"address"`
	LocationGeography Point  `json:"location_geography"`
	Ward              string `json:"ward"`
	WardCode          string `json:"ward_code"`
	District          string `json:"district"`
	DistrictCode      string `json:"district_code"`
	Province          string `json:"province"`
	ProvinceCode      string `json:"province_code"`
}

type AddressesResponse struct {
	Addresses  []AddressResponse `json:"addresses"`
	Total      uint              `json:"total"`
	Pagination *utils.Pagination `json:"pagination"`
}

type LocationResponse struct {
	ID     string `json:"id"`
	Name   string `json:"name"`
	NameEn string `json:"name_en"`
	Code   string `json:"code"`
}

func NewSearchLocationRequest(province, district, ward string) *SearchByIDRequest {
	return &SearchByIDRequest{
		ProvinceID: province,
		DistrictID: district,
		WardID:     ward,
	}
}

type AddressWithDistance struct {
	entities.Address
	Distance float64
}
