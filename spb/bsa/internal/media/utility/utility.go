package utility

import (
	"spb/bsa/internal/media/model"
	tb "spb/bsa/pkg/entities"
)

// @author: LoanTT
// @function: MapMediaEntityToResponse
// @description: Map media entity to response
// @param: media *tb.Media
// @return: model.MediaResponse
func MapMediaEntityToResponse(media *tb.Media) model.MediaResponse {
	return model.MediaResponse{
		MediaID:    media.ID,
		FilePath:   media.FilePath,
		FileType:   media.FileType,
		Hash:       media.Hash,
		UploadedAt: media.UploadedAt,
	}
}

// @author: LoanTT
// @function: MapCreateRequestToEntity
// @description: Mapping create media request to media entity
// @param: reqBody *model.CreateMediaRequest
// @return: *tb.Media
func MapCreateRequestToEntity(reqBody *model.CreateMediaRequest) *tb.Media {
	return &tb.Media{
		FilePath:   reqBody.FilePath,
		FileType:   reqBody.FileType,
		Hash:       reqBody.Hash,
		UploadedAt: reqBody.UploadedAt,
	}
}

// @author: LoanTT
// @function: MapCreateRequestToEntities
// @description: Mapping create media request to media entity
// @param: reqBody []model.CreateMediaRequest
// @return: []tb.Media
func MapCreateRequestToEntities(reqBody []model.CreateMediaRequest) []tb.Media {
	medias := make([]tb.Media, len(reqBody))
	for _, media := range reqBody {
		medias = append(medias, *MapCreateRequestToEntity(&media))
	}
	return medias
}

// @author: LoanTT
// @function: MapUpdateRequestToEntity
// @description: mapping update fields
// @param: reqBody *model.UpdateMediaRequest
// @return: tb.Media
func MapUpdateRequestToEntity(reqBody *model.UpdateMediaRequest) tb.Media {
	return tb.Media{
		FilePath:   *reqBody.FilePath,
		FileType:   *reqBody.FileType,
		Hash:       *reqBody.Hash,
		UploadedAt: reqBody.UploadedAt,
	}
}

// @author: LoanTT
// @function: MapUpdateRequestToEntities
// @description: mapping update fields
// @param: reqBody []model.UpdateMediaRequest
// @return: []tb.Media
func MapUpdateRequestToEntities(reqBody []model.UpdateMediaRequest) []tb.Media {
	medias := make([]tb.Media, len(reqBody))
	for _, media := range reqBody {
		medias = append(medias, MapUpdateRequestToEntity(&media))
	}
	return medias
}
