package model

var ORDER_BY = []string{
	"created_at",
	"updated_at",
}

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
}
