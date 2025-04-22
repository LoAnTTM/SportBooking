package model

import (
	address "spb/bsa/api/address/model"
	media "spb/bsa/api/media/model"
	st "spb/bsa/api/sport_type/model"
	up "spb/bsa/api/unit_price/model"
	us "spb/bsa/api/unit_service/model"
)

var ORDER_BY = []string{
	"name",
	"open_time",
	"created_at",
}

type CreateUnitRequest struct {
	Name         string                         `json:"name" validate:"required,max=255"`
	OpenTime     string                         `json:"open_time" validate:"required,yy:mm"`
	CloseTime    string                         `json:"close_time" validate:"required,yy:mm"`
	Phone        string                         `json:"phone" validate:"required,e164"`
	Description  string                         `json:"description" validate:"omitempty,max=3000"`
	Status       int8                           `json:"status" validate:"oneof=0 1"`
	ClubID       string                         `json:"club_id" validate:"required"`
	Address      *address.CreateAddressRequest  `json:"address" validate:"required"`
	UnitPrices   []*up.CreateUnitPriceRequest   `json:"unit_prices" validate:"required"`
	UnitServices []*us.CreateUnitServiceRequest `json:"unit_services" validate:"omitempty"`
	Media        []*media.CreateMediaRequest    `json:"media" validate:"required"`
	SportTypes   []string                       `json:"sport_types" validate:"required"`
}

type UpdateUnitRequest struct {
	Name         string                        `json:"name,omitempty" validate:"omitempty,max=255"`
	OpenTime     string                        `json:"open_time,omitempty" validate:"omitempty,yy:mm"`
	CloseTime    string                        `json:"close_time,omitempty" validate:"omitempty,yy:mm"`
	Phone        string                        `json:"phone,omitempty" validate:"omitempty,e164"`
	Description  string                        `json:"description,omitempty" validate:"omitempty,max=3000"`
	Status       *int8                         `json:"status,omitempty" validate:"omitempty,oneof=0 1"`
	ClubID       string                        `json:"club_id"`
	Address      *address.UpdateAddressRequest `json:"address,omitempty" validate:"omitempty"`
	UnitPrices   []up.UpdateUnitPriceRequest   `json:"unit_prices,omitempty" validate:"omitempty"`
	UnitServices []us.UpdateUnitServiceRequest `json:"unit_services,omitempty" validate:"omitempty"`
	SportTypes   []string                      `json:"sport_types,omitempty" validate:"omitempty"`
}

type UnitResponse struct {
	ID           string                    `json:"id"`
	Name         string                    `json:"name"`
	OpenTime     string                    `json:"open_time"`
	CloseTime    string                    `json:"close_time"`
	Phone        string                    `json:"phone"`
	Description  string                    `json:"description"`
	Status       int8                      `json:"status"`
	ClubID       string                    `json:"club_id"`
	Address      *address.AddressResponse  `json:"address"`
	UnitPrices   []*up.UnitPriceResponse   `json:"unit_prices"`
	UnitServices []*us.UnitServiceResponse `json:"unit_services"`
	Media        []*media.MediaResponse    `json:"media"`
	SportTypes   []*st.SportTypeResponse   `json:"sport_types"`
}

type UnitsResponse struct {
	Units      []*UnitResponse `json:"units"`
	Total      int             `json:"total"`
	Pagination *UnitPagination `json:"pagination"`
}

type SearchUnitRequest struct {
	Pagination *UnitPagination
}

type BookedTimeRequest struct {
	BookedDay string `json:"booked_day" validate:"required,datetime=2006-01-02"`
}

type BookedTime struct {
	StartTime string `json:"start_time"`
	EndTime   string `json:"end_time"`
}

type BookedTimeResponse struct {
	BookedTime []BookedTime `json:"booked_times"`
	Total      int          `json:"total"`
}

type PopularityRequest struct {
	Longitude float64 `json:"longitude" validate:"required"`
	Latitude  float64 `json:"latitude" validate:"required"`
	Radius    int     `json:"radius" validate:"required"`
	Limit     int     `json:"limit" validate:"required"`
	TopN      int     `json:"top_n" validate:"required"`
}

type UnitIDOnly struct {
	ID string
}
