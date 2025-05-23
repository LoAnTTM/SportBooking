package model

import (
	"spb/bsa/pkg/utils"
)

type GetMetadatasRequest struct {
	Key string `json:"key" validate:"min=1,max=255,required"`
}

type MetadataResponse struct {
	MetadataID  string `json:"metadata_id"`
	Key         string `json:"key"`
	Value       string `json:"value"`
	Description string `json:"description"`
}

type MetadatasResponse struct {
	Metadatas  []MetadataResponse `json:"metadatas"`
	Total      uint               `json:"total"`
	Pagination *utils.Pagination  `json:"pagination"`
}

type UpdateMetadataRequest struct {
	Value       *string `json:"value,omitempty" validate:"omitempty,min=1,max=3000"`
	Description *string `json:"description,omitempty" validate:"omitempty,min=1,max=3000"`
}
