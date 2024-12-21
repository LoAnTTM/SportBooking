package model

import (
	"spb/bsa/pkg/utils"
)

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
	UnitServiceId string  `json:"unit_service_id"`
	Icon          string  `json:"icon"`
	Price         float32 `json:"price"`
	Description   string  `json:"description,omitempty"`
	UnitID        string  `json:"unit_id"`
}

type CreateUnitServiceRequest struct {
	Icon        string  `json:"icon" validate:"required,max=255"`
	Price       float32 `json:"price" validate:"gt=0"`
	Description string  `json:"description,omitempty" validate:"omitempty,max=3000"`
	UnitID      string  `json:"unit_id"`
}

type UpdateUnitServiceRequest struct {
	Icon        *string  `json:"icon,omitempty" validate:"omitempty,max=255"`
	Price       *float32 `json:"price,omitempty" validate:"omitempty,gt=0"`
	Description *string  `json:"description,omitempty" validate:"omitempty,max=3000"`
}
