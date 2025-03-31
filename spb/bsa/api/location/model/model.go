package model

import "spb/bsa/pkg/utils"

var ORDER_BY = []string{
	"province",
	"city",
	"district",
	"created_at",
	"updated_at",
}

type LocationRequest struct {
	Province    string `json:"province" validate:"required,min=2,max=255"`
	City        string `json:"city" validate:"required,min=2,max=255"`
	District    string `json:"district" validate:"required,min=2,max=255"`
	Description string `json:"description" validate:"omitempty,max=3000"`
}

type LocationResponse struct {
	LocationID   string `json:"location_id"`
	Province     string `json:"province"`
	ProvinceSlug string `json:"province_slug"`
	City         string `json:"city"`
	CitySlug     string `json:"city_slug"`
	District     string `json:"district"`
	DistrictSlug string `json:"district_slug"`
	Description  string `json:"description"`
}

type LocationsResponse struct {
	Locations  []*LocationResponse `json:"locations"`
	Total      int                 `json:"total"`
	Pagination utils.Pagination    `json:"pagination"`
}

type CreateLocationRequest struct {
	Locations []LocationRequest `json:"locations" validate:"required,min=1"`
}

type UpdateLocationRequest struct {
	Province    *string `json:"province,omitempty" validate:"omitempty,min=2,max=255"`
	City        *string `json:"city,omitempty" validate:"omitempty,min=2,max=255"`
	District    *string `json:"district,omitempty" validate:"omitempty,min=2,max=255"`
	Description *string `json:"description,omitempty" validate:"omitempty,max=3000"`
}

type GetLocationsRequest struct {
	Pagination utils.Pagination
}

type SearchLocationRequest struct {
	Province string `json:"province"`
	City     string `json:"city"`
	District string `json:"district"`
}

func NewSearchLocationRequest(province, city, district string) *SearchLocationRequest {
	return &SearchLocationRequest{
		Province: province,
		City:     city,
		District: district,
	}
}
