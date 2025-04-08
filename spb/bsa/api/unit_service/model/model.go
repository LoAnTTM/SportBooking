package model

import (
	"spb/bsa/pkg/utils"
)

var ORDER_BY = []string{
	"price",
	"created_at",
	"updated_at",
}

type GetUnitServicesRequest struct {
	Pagination utils.Pagination `json:"pagination"`
	UnitID     string           `json:"unit_id"`
}

type UnitServicesResponse struct {
	UnitServices []*UnitServiceResponse `json:"unit_services"`
	Total        uint                   `json:"total"`
	Pagination   *utils.Pagination      `json:"pagination"`
}

type UnitServiceResponse struct {
	ID          string  `json:"id"`
	Name        string  `json:"name"`
	Icon        string  `json:"icon"`
	Price       float32 `json:"price"`
	Currency    string  `json:"currency"`
	Description string  `json:"description,omitempty"`
	UnitID      string  `json:"unit_id"`
	Status      int8    `json:"status"`
}

type CreateUnitServiceRequest struct {
	Name        string  `json:"name" validate:"required,max=255"`
	Icon        string  `json:"icon" validate:"required,max=255"`
	Price       float32 `json:"price" validate:"gt=0"`
	Status      int8    `json:"status" validate:"oneof=0 1"`
	Currency    string  `json:"currency" validate:"len=3"`
	Description string  `json:"description,omitempty" validate:"omitempty,max=3000"`
	UnitID      string  `json:"unit_id"`
}

type UpdateUnitServiceRequest struct {
	Name        string   `json:"name,omitempty" validate:"omitempty,max=255"`
	Icon        string   `json:"icon,omitempty" validate:"omitempty,max=255"`
	Price       *float32 `json:"price,omitempty" validate:"omitempty,gt=0"`
	Status      *int8    `json:"status,omitempty" validate:"omitempty,oneof=0 1"`
	Currency    string   `json:"currency,omitempty" validate:"omitempty,len=3"`
	Description string   `json:"description,omitempty" validate:"omitempty,max=3000"`
}
