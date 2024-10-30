package utility

import (
	"spb/bsa/internal/metadata/model"
	tb "spb/bsa/pkg/entities"
)

// @author: LoanTT
// @function: MapMetadataEntityToResponse
// @description: mapping metadata entity to response
// @param: metadata *tb.Metadata
// @return: model.MetadataResponse
func MapMetadataEntityToResponse(metadata *tb.Metadata) model.MetadataResponse {
	return model.MetadataResponse{
		MetadataID:  metadata.ID,
		Key:         metadata.Key,
		Value:       metadata.Value,
		Description: metadata.Description,
	}
}

// @author: LoanTT
// @function: MapUpdateRequestToEntity
// @description: mapping update fields
// @param: reqBody *model.UpdateMetadataRequest
// @return: tb.Metadata
func MapUpdateRequestToEntity(reqBody *model.UpdateMetadataRequest) tb.Metadata {
	var updatedMetadata tb.Metadata
	if reqBody.Value != nil {
		updatedMetadata.Value = *reqBody.Value
	}
	if reqBody.Description != nil {
		updatedMetadata.Description = *reqBody.Description
	}

	return updatedMetadata
}
