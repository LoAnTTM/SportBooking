package utility

import (
	"spb/bsa/internal/unit_service/model"
	tb "spb/bsa/pkg/entities"
)

// @author: LoanTT
// @function: Map unit_service entity to response
// @description: Map unit_service entity to response
// @param: *tb.UnitService
// @return: *model.UnitServiceResponse
func MapUnitServiceEntityToResponse(unitService *tb.UnitService) *model.UnitServiceResponse {
	return &model.UnitServiceResponse{
		UnitServiceId: unitService.ID,
		Icon:          unitService.Icon,
		Price:         unitService.Price,
		Description:   unitService.Description,
		UnitID:        unitService.UnitID,
	}
}

// @author: LoanTT
// @function: MapUnitServiceEntitiesToResponse
// @description: map unit_services entity to response
// @param: []*tb.UnitService
// @param: *model.GetUnitServicesRequest
// @return: *model.UnitServicesResponse
func MapUnitServiceEntitiesToResponse(unitServices []*tb.UnitService, reqBody *model.GetUnitServicesRequest) *model.UnitServicesResponse {
	res := new(model.UnitServicesResponse)
	for _, unit_service := range unitServices {
		res.UnitServices = append(res.UnitServices, MapUnitServiceEntityToResponse(unit_service))
	}

	unitServiceNum := len(res.UnitServices)
	res.Total = uint(unitServiceNum)
	res.Pagination = &reqBody.Pagination
	res.Pagination.SetPagination(unitServiceNum)
	return res
}

// @author: LoanTT
// @function: MapCreateRequestToEntity
// @description: Mapping create unitService request to unitService entity
// @param: reqBody model.CreateUnitServiceRequest
// @return: *tb.UnitService
func MapCreateRequestToEntity(reqBody *model.CreateUnitServiceRequest) *tb.UnitService {
	return &tb.UnitService{
		Icon:        reqBody.Icon,
		Price:       reqBody.Price,
		Description: reqBody.Description,
		UnitID:      reqBody.UnitID,
	}
}

// @author: LoanTT
// @function: MapCreateRequestToEntities
// @description: Mapping create unitService request to unitService entity
// @param: reqBody []model.CreateUnitServiceRequest
// @return: []tb.UnitService
func MapCreateRequestToEntities(reqBody []model.CreateUnitServiceRequest) []tb.UnitService {
	var unitServices []tb.UnitService
	for _, unitService := range reqBody {
		unitServices = append(unitServices, *MapCreateRequestToEntity(&unitService))
	}
	return unitServices
}

// @author: LoanTT
// @function: MapUpdateRequestToEntity
// @description: mapping update fields
// @param: reqBody *model.UpdateUnitServiceRequest
// @return: tb.UnitService
func MapUpdateRequestToEntity(reqBody *model.UpdateUnitServiceRequest) tb.UnitService {
	var unitServiceUpdate tb.UnitService

	if reqBody.Icon != nil {
		unitServiceUpdate.Icon = *reqBody.Icon
	}
	if reqBody.Price != nil {
		unitServiceUpdate.Price = *reqBody.Price
	}
	if reqBody.Description != nil {
		unitServiceUpdate.Description = *reqBody.Description
	}

	return unitServiceUpdate
}

// @author: LoanTT
// @function: MapUpdateRequestToEntities
// @description: mapping update fields
// @param: reqBody []model.UpdateUnitServiceRequest
// @return: []tb.UnitService
func MapUpdateRequestToEntities(reqBody []model.UpdateUnitServiceRequest) []tb.UnitService {
	var unitServices []tb.UnitService
	for _, unitService := range reqBody {
		unitServices = append(unitServices, MapUpdateRequestToEntity(&unitService))
	}
	return unitServices
}
