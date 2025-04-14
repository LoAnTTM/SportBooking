package model

import (
	"spb/bsa/pkg/utils"
)

var ORDER_BY = []string{
	"price",
	"created_at",
	"updated_at",
}

type GetUnitPricesRequest struct {
	Pagination utils.Pagination
	UnitID     string `json:"unit_id"`
}

type UnitPriceResponse struct {
	ID        string `json:"id"`
	Price     int64  `json:"price"`
	Currency  string `json:"currency"`
	StartTime string `json:"start_time"`
	EndTime   string `json:"end_time"`
}

type UnitPricesResponse struct {
	UnitPrices []UnitPriceResponse `json:"unit_prices"`
	Total      uint                `json:"total"`
	Pagination utils.Pagination    `json:"pagination"`
}

type CreateUnitPriceRequest struct {
	Price     int64  `json:"price" validate:"gt=0"`
	Currency  string `json:"currency" validate:"omitempty,max=3"`
	StartTime string `json:"start_time" validate:"yy:mm"`
	EndTime   string `json:"end_time" validate:"yy:mm"`
}

type UpdateUnitPriceRequest struct {
	Price     *int64 `json:"price,omitempty" validate:"omitempty,gt=0"`
	Currency  string `json:"currency,omitempty" validate:"omitempty,max=3"`
	StartTime string `json:"start_time,omitempty" validate:"omitempty,yy:mm"`
	EndTime   string `json:"end_time,omitempty" validate:"omitempty,yy:mm"`
}
