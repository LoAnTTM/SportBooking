package model

import "time"

type MediaResponse struct {
	MediaID    string    `json:"media_id"`
	FilePath   string    `json:"file_path"`
	FileType   string    `json:"file_type"`
	Hash       string    `json:"hash"`
	UploadedAt time.Time `json:"uploaded_at"`
}

type CreateMediaRequest struct {
	FilePath   string    `json:"file_path" validate:"required,max=255"`
	FileType   string    `json:"file_type" validate:"required,max=255"`
	Hash       string    `json:"hash" validate:"required,max=255"`
	UploadedAt time.Time `json:"uploaded_at" validate:"required,time"`
}

type UpdateMediaRequest struct {
	FilePath   *string   `json:"file_path" validate:"omitempty,max=255"`
	FileType   *string   `json:"file_type" validate:"omitempty,max=255"`
	Hash       *string   `json:"hash" validate:"omitempty,max=255"`
	UploadedAt time.Time `json:"uploaded_at" validate:"time"`
}
