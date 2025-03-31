package utility

import (
	"spb/bsa/api/sport_type/model"
	tb "spb/bsa/pkg/entities"
)

// @author: LoanTT
// @function: MapSportTypeEntityToResponse
// @description: Mapping sportType entity to response
// @param: sportType tb.SportType
// @return: model.SportTypeResponse
func MapSportTypeEntityToResponse(sportType *tb.SportType) *model.SportTypeResponse {
	return &model.SportTypeResponse{
		ID:   sportType.ID,
		Name: sportType.Name,
	}
}

// @author: LoanTT
// @function: MapSportTypeEntitiesToResponse
// @description: Mapping sportType entities to response
// @param: sportTypes []*tb.SportType
// @return: model.SportTypesResponse
func MapSportTypeEntitiesToResponse(sportTypes []*tb.SportType) *model.SportTypesResponse {
	sportTypeResponses := new(model.SportTypesResponse)
	for _, sportType := range sportTypes {
		sportTypeResponses.SportTypes = append(sportTypeResponses.SportTypes, *MapSportTypeEntityToResponse(sportType))
	}
	sportTypeResponses.Total = uint(len(sportTypes))
	return sportTypeResponses
}

// @author: LoanTT
// @function: MapSportTypeEntitiesToListResponse
// @description: Mapping sportType entities to list response
// @param: sportTypes []*tb.SportType
// @return: []*model.SportTypeResponse
func MapSportTypeEntitiesToListResponse(sportTypes []*tb.SportType) []*model.SportTypeResponse {
	sportTypeResponses := make([]*model.SportTypeResponse, 0)
	for _, sportType := range sportTypes {
		sportTypeResponses = append(sportTypeResponses, MapSportTypeEntityToResponse(sportType))
	}
	return sportTypeResponses
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
func MapCreateRequestToEntities(reqBody []*model.CreateSportTypeRequest) []*tb.SportType {
	sportTypes := make([]*tb.SportType, 0)
	for _, sportType := range reqBody {
		sportTypes = append(sportTypes, MapCreateRequestToEntity(sportType))
	}
	return sportTypes
}

// @author: LoanTT
// @function: MapUpdateRequestToEntity
// @description: mapping update fields
// @param: reqBody *model.UpdateSportTypeRequest
// @return: *tb.SportType
func MapUpdateRequestToEntity(reqBody *model.UpdateSportTypeRequest) *tb.SportType {
	sportTypeUpdate := new(tb.SportType)

	sportTypeUpdate.Name = reqBody.Name
	return sportTypeUpdate
}

// @author: LoanTT
// @function: MapUpdateRequestToEntities
// @description: mapping update fields
// @param: reqBody []model.UpdateSportTypeRequest
// @return: []tb.SportType
func MapUpdateRequestToEntities(reqBody []*model.UpdateSportTypeRequest) []*tb.SportType {
	sportTypes := make([]*tb.SportType, 0)
	for _, sportType := range reqBody {
		sportTypes = append(sportTypes, MapUpdateRequestToEntity(sportType))
	}
	return sportTypes
}
