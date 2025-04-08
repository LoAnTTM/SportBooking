package utility

import (
	"strings"

	"spb/bsa/api/unit_service/model"
	tb "spb/bsa/pkg/entities"
)

// @author: LoanTT
// @function: Map unit_service entity to response
// @description: Map unit_service entity to response
// @param: *tb.UnitService
// @return: *model.UnitServiceResponse
func MapUnitServiceEntityToResponse(unitService *tb.UnitService) *model.UnitServiceResponse {
	return &model.UnitServiceResponse{
		ID:          unitService.ID,
		Icon:        unitService.Icon,
		Price:       unitService.Price,
		Description: unitService.Description,
		Status:      unitService.Status,
		Currency:    unitService.Currency,
		Name:        unitService.Name,
		UnitID:      unitService.UnitID,
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
	res.Pagination.SetNewPagination(unitServiceNum)
	return res
}

// @author: LoanTT
// @function: MapCreateRequestToEntity
// @description: Mapping create unitService request to unitService entity
// @param: reqBody model.CreateUnitServiceRequest
// @return: *tb.UnitService
func MapCreateRequestToEntity(reqBody *model.CreateUnitServiceRequest) *tb.UnitService {
	return &tb.UnitService{
		Name:        reqBody.Name,
		Icon:        reqBody.Icon,
		Price:       reqBody.Price,
		Description: reqBody.Description,
		Status:      reqBody.Status,
		Currency:    reqBody.Currency,
		UnitID:      reqBody.UnitID,
	}
}

// @author: LoanTT
// @function: MapCreateRequestToEntities
// @description: Mapping create unitService request to unitService entity
// @param: reqBody []model.CreateUnitServiceRequest
// @return: []tb.UnitService
func MapCreateRequestToEntities(reqBody []*model.CreateUnitServiceRequest) []*tb.UnitService {
	var unitServices []*tb.UnitService
	for _, unitService := range reqBody {
		unitServices = append(unitServices, MapCreateRequestToEntity(unitService))
	}
	return unitServices
}

// @author: LoanTT
// @function: MapUpdateRequestToEntity
// @description: mapping update fields
// @param: reqBody model.UpdateUnitServiceRequest
// @return: *tb.UnitService
func MapUpdateRequestToEntity(reqBody model.UpdateUnitServiceRequest) *tb.UnitService {
	updates := new(tb.UnitService)

	if trimmed := strings.TrimSpace(reqBody.Name); trimmed != "" {
		updates.Name = trimmed
	}
	if trimmed := strings.TrimSpace(reqBody.Icon); trimmed != "" {
		updates.Icon = trimmed
	}
	if reqBody.Price != nil {
		updates.Price = *reqBody.Price
	}
	if trimmed := strings.TrimSpace(reqBody.Currency); trimmed != "" {
		updates.Currency = trimmed
	}
	if trimmed := strings.TrimSpace(reqBody.Description); trimmed != "" {
		updates.Description = trimmed
	}
	if reqBody.Status != nil {
		updates.Status = *reqBody.Status
	}

	return updates
}

// @author: LoanTT
// @function: MapUpdateRequestToEntities
// @description: mapping update fields
// @param: reqBody []*model.UpdateUnitServiceRequest
// @return: []*tb.UnitService
func MapUpdateRequestToEntities(reqBody []model.UpdateUnitServiceRequest) []*tb.UnitService {
	updates := make([]*tb.UnitService, 0, len(reqBody))
	for _, service := range reqBody {
		updates = append(updates, MapUpdateRequestToEntity(service))
	}
	return updates
}

func MapUnitServicesEntitiesToListResponse(unitServices []*tb.UnitService) []*model.UnitServiceResponse {
	unitServicesResponse := make([]*model.UnitServiceResponse, len(unitServices))
	for i, unitService := range unitServices {
		unitServicesResponse[i] = MapUnitServiceEntityToResponse(unitService)
	}
	return unitServicesResponse
}
