package model

import (
	"spb/bsa/pkg/utils"
)

type CreateSportTypeRequest struct {
	Name string `json:"name" validate:"required,max=255"`
}

type UpdateSportTypeRequest struct {
	Name string `json:"name" validate:"required,max=255"`
}

type SportTypeResponse struct {
	ID   string `json:"id"`
	Name string `json:"name"`
}

type SportTypesResponse struct {
	SportTypes []SportTypeResponse `json:"sport_types"`
	Total      uint                `json:"total"`
	Pagination *utils.Pagination   `json:"pagination"`
}
