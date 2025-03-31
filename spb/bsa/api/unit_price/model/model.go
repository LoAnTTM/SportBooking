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
	Pagination utils.Pagination `json:"pagination"`
	UnitID     string           `json:"unit_id"`
}

type UnitPriceResponse struct {
	UnitPriceId string  `json:"unitPrice_id"`
	Price       float32 `json:"price"`
	StartTime   string  `json:"start_time"`
	EndTime     string  `json:"end_time"`
}

type UnitPricesResponse struct {
	UnitPrices []UnitPriceResponse `json:"unit_prices"`
	Total      uint                `json:"total"`
	Pagination utils.Pagination    `json:"pagination"`
}

type CreateUnitPriceRequest struct {
	Price     float32 `json:"price" validate:"gt=0"`
	StartTime string  `json:"start_time" validate:"yy:mm"`
	EndTime   string  `json:"end_time" validate:"yy:mm"`
}

type UpdateUnitPriceRequest struct {
	Price     *float32 `json:"price,omitempty" validate:"omitempty,gt=0"`
	StartTime *string  `json:"start_time,omitempty" validate:"omitempty,yy:mm"`
	EndTime   *string  `json:"end_time,omitempty" validate:"omitempty,yy:mm"`
}
