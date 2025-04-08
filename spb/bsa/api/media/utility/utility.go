package utility

import (
	"strings"

	"spb/bsa/api/media/model"
	tb "spb/bsa/pkg/entities"
)

// @author: LoanTT
// @function: MapMediaEntityToResponse
// @description: Map media entity to response
// @param: media *tb.Media
// @return: model.MediaResponse
func MapMediaEntityToResponse(media *tb.Media) *model.MediaResponse {
	return &model.MediaResponse{
		MediaID:  media.ID,
		FilePath: media.FilePath,
		FileType: media.FileType,
		Hash:     media.Hash,
	}
}

// @author: LoanTT
// @function: MapMediaEntitiesToResponse
// @description: Map media entities to response
// @param: medias []tb.Media
// @return: []model.MediaResponse
func MapMediaEntitiesToResponse(medias []*tb.Media) []*model.MediaResponse {
	mediaResponses := make([]*model.MediaResponse, 0)
	for _, media := range medias {
		mediaResponses = append(mediaResponses, MapMediaEntityToResponse(media))
	}
	return mediaResponses
}

// @author: LoanTT
// @function: MapCreateRequestToEntity
// @description: Mapping create media request to media entity
// @param: reqBody *model.CreateMediaRequest
// @return: *tb.Media
func MapCreateRequestToEntity(reqBody *model.CreateMediaRequest) *tb.Media {
	return &tb.Media{
		FilePath: reqBody.FilePath,
		FileType: reqBody.FileType,
		Hash:     reqBody.Hash,
	}
}

// @author: LoanTT
// @function: MapCreateRequestToEntities
// @description: Mapping create media request to media entity
// @param: reqBody []model.CreateMediaRequest
// @return: []tb.Media
func MapCreateRequestToEntities(reqBody []*model.CreateMediaRequest) []*tb.Media {
	medias := make([]*tb.Media, 0)
	for _, media := range reqBody {
		medias = append(medias, MapCreateRequestToEntity(media))
	}
	return medias
}

// @author: LoanTT
// @function: MapUpdateRequestToEntity
// @description: mapping update fields
// @param: reqBody model.UpdateMediaRequest
// @return: map[string]interface{}
func MapUpdateRequestToEntity(reqBody model.UpdateMediaRequest) map[string]interface{} {
	updates := make(map[string]interface{})

	if trimmed := strings.TrimSpace(reqBody.ID); trimmed != "" {
		updates["id"] = trimmed
	}

	if trimmed := strings.TrimSpace(reqBody.FilePath); trimmed != "" {
		updates["file_path"] = trimmed
	}

	if trimmed := strings.TrimSpace(reqBody.FileType); trimmed != "" {
		updates["file_type"] = trimmed
	}

	if trimmed := strings.TrimSpace(reqBody.Hash); trimmed != "" {
		updates["hash"] = trimmed
	}

	return updates
}

// @author: LoanTT
// @function: MapUpdateRequestToEntities
// @description: mapping update fields
// @param: reqBody []model.UpdateMediaRequest
// @return: []map[string]interface{}
func MapUpdateRequestToEntities(reqBody []model.UpdateMediaRequest) []map[string]interface{} {
	medias := make([]map[string]interface{}, 0, len(reqBody))
	for _, media := range reqBody {
		medias = append(medias, MapUpdateRequestToEntity(media))
	}
	return medias
}

func MapUpdateRequestToIDs(reqBody []model.UpdateMediaRequest) []string {
	ids := make([]string, 0, len(reqBody))
	for _, media := range reqBody {
		ids = append(ids, media.ID)
	}
	return ids
}
