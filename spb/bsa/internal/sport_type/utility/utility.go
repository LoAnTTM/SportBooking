package utility

import (
	"spb/bsa/internal/sport_type/model"
	tb "spb/bsa/pkg/entities"
)

// @author: LoanTT
// @function: MapSportTypeEntityToResponse
// @description: Mapping sportType entity to response
// @param: sportType tb.SportType
// @return: model.SportTypeResponse
func MapSportTypeEntityToResponse(sportType *tb.SportType) model.SportTypeResponse {
	return model.SportTypeResponse{
		SportTypeID: sportType.ID,
	}
}

// @author: LoanTT
// @function: MapCreateRequestToEntity
// @description: Mapping create sportType request to sportType entity
// @param: reqBody *model.CreateSportTypeRequest
// @return: *tb.SportType
func MapCreateRequestToEntity(reqBody *model.CreateSportTypeRequest) *tb.SportType {
	return &tb.SportType{
		Name: reqBody.Name,
	}
}

// @author: LoanTT
// @function: MapCreateRequestToEntities
// @description: Mapping create sportType request to sportType entity
// @param: reqBody []model.CreateSportTypeRequest
// @return: []tb.SportType
func MapCreateRequestToEntities(reqBody []model.CreateSportTypeRequest) []tb.SportType {
	sportTypes := make([]tb.SportType, len(reqBody))
	for _, sportType := range reqBody {
		sportTypes = append(sportTypes, *MapCreateRequestToEntity(&sportType))
	}
	return sportTypes
}

// @author: LoanTT
// @function: MapUpdateRequestToEntity
// @description: mapping update fields
// @param: reqBody *model.UpdateSportTypeRequest
// @return: tb.SportType
func MapUpdateRequestToEntity(reqBody *model.UpdateSportTypeRequest) tb.SportType {
	var sportTypeUpdate tb.SportType

	sportTypeUpdate.Name = reqBody.Name
	return sportTypeUpdate
}

// @author: LoanTT
// @function: MapUpdateRequestToEntities
// @description: mapping update fields
// @param: reqBody []model.UpdateSportTypeRequest
// @return: []tb.SportType
func MapUpdateRequestToEntities(reqBody []model.UpdateSportTypeRequest) []tb.SportType {
	sportTypes := make([]tb.SportType, len(reqBody))
	for _, sportType := range reqBody {
		sportTypes = append(sportTypes, MapUpdateRequestToEntity(&sportType))
	}
	return sportTypes
}
