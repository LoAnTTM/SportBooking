package model

import (
	"spb/bsa/pkg/utils"
)

type GetSportTypesRequest struct {
	Pagination utils.Pagination
}

type SportTypeResponse struct {
	SportTypeID string `json:"sportType_id"`
	Name        string `json:"name"`
}

type SportTypesResponse struct {
	SportTypes []SportTypeResponse `json:"sport_types"`
	Total      uint                `json:"total"`
	Pagination *utils.Pagination   `json:"pagination"`
}

type CreateSportTypeRequest struct {
	Name string `json:"name" validate:"required,max=255"`
}

type UpdateSportTypeRequest struct {
	Name string `json:"name" validate:"required,max=255"`
}
