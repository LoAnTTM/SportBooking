package model

import (
	address "spb/bsa/internal/address/model"
	media "spb/bsa/internal/media/model"
	st "spb/bsa/internal/sport_type/model"
	up "spb/bsa/internal/unit_price/model"
	us "spb/bsa/internal/unit_service/model"
	"spb/bsa/pkg/utils"
)

type GetUnitsRequest struct {
	Pagination utils.Pagination
	Search     string
}

type UnitResponse struct {
	UnitID       string                   `json:"unit_id"`
	Name         string                   `json:"name"`
	OpenTime     string                   `json:"open_time"`
	CloseTime    string                   `json:"close_time"`
	Phone        string                   `json:"phone"`
	Description  string                   `json:"description"`
	Status       int8                     `json:"status"`
	ClubID       string                   `json:"club_id"`
	Address      address.AddressResponse  `json:"address"`
	UnitPrices   []up.UnitPriceResponse   `json:"unit_prices"`
	UnitServices []us.UnitServiceResponse `json:"unit_services"`
	Media        []media.MediaResponse    `json:"media"`
	SportTypes   []st.SportTypeResponse   `json:"sport_types"`
}

type UnitsResponse struct {
	Units      []UnitResponse    `json:"units"`
	Total      uint              `json:"total"`
	Pagination *utils.Pagination `json:"pagination"`
}

type CreateUnitRequest struct {
	Name         string                        `json:"name" validate:"required,max=255"`
	OpenTime     string                        `json:"open_time" validate:"required,yy_mm"`
	CloseTime    string                        `json:"close_time" validate:"required,yy_mm"`
	Phone        string                        `json:"phone" validate:"required,e164"`
	Description  string                        `json:"description" validate:"omitempty,max=3000"`
	Status       int8                          `json:"status" validate:"oneof=0 1"`
	ClubID       string                        `json:"club_id" validate:"required,type=uuid"`
	Address      address.CreateAddressRequest  `json:"address" validate:"required"`
	UnitPrices   []up.CreateUnitPriceRequest   `json:"unit_prices" validate:"required"`
	UnitServices []us.CreateUnitServiceRequest `json:"unit_services" validate:"omitempty"`
	Media        []media.CreateMediaRequest    `json:"media" validate:"required"`
	SportTypes   []st.CreateSportTypeRequest   `json:"sport_types" validate:"required"`
}

type UpdateUnitRequest struct {
	Name         *string                        `json:"name,omitempty" validate:"omitempty,max=255"`
	OpenTime     *string                        `json:"open_time,omitempty" validate:"omitempty,yy_mm"`
	CloseTime    *string                        `json:"close_time,omitempty" validate:"omitempty,yy_mm"`
	Phone        *string                        `json:"phone,omitempty" validate:"omitempty,e164"`
	Description  *string                        `json:"description,omitempty" validate:"omitempty,max=3000"`
	Status       *int8                          `json:"status,omitempty" validate:"omitempty,oneof=0 1"`
	ClubID       *string                        `json:"club_id" validate:"type=uuid"`
	Address      *address.UpdateAddressRequest  `json:"address,omitempty" validate:"omitempty"`
	UnitPrices   *[]up.UpdateUnitPriceRequest   `json:"unit_prices,omitempty" validate:"omitempty"`
	UnitServices *[]us.UpdateUnitServiceRequest `json:"unit_services,omitempty" validate:"omitempty"`
	Media        *[]media.UpdateMediaRequest    `json:"media,omitempty" validate:"omitempty"`
	SportTypes   *[]st.UpdateSportTypeRequest   `json:"sport_types,omitempty" validate:"omitempty"`
}
