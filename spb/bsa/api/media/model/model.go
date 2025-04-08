package model

type OwnerType string

var (
	OwnerTypeClub OwnerType = "club"
	OwnerTypeUnit OwnerType = "unit"
)

type MediaResponse struct {
	MediaID  string `json:"media_id"`
	FilePath string `json:"file_path"`
	FileType string `json:"file_type"`
	Hash     string `json:"hash"`
}

type CreateMediaRequest struct {
	FilePath string `json:"file_path" validate:"required,max=255"`
	FileType string `json:"file_type" validate:"required,max=255"`
	Hash     string `json:"hash" validate:"required,max=255"`
}

type UpdateMediaRequest struct {
	ID       string `json:"id" validate:"required"`
	FilePath string `json:"file_path" validate:"omitempty,max=255"`
	FileType string `json:"file_type" validate:"omitempty,max=255"`
	Hash     string `json:"hash" validate:"omitempty,max=255"`
}
