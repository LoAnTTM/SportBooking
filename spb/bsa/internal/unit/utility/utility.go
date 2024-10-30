package utility

import (
	au "spb/bsa/internal/address/utility"
	mu "spb/bsa/internal/media/utility"
	stu "spb/bsa/internal/sport_type/utility"
	"spb/bsa/internal/unit/model"
	upu "spb/bsa/internal/unit_price/utility"
	usu "spb/bsa/internal/unit_service/utility"
	tb "spb/bsa/pkg/entities"
)

// @author: LoanTT
// @function: MapUnitEntityToResponse
// @description: Mapping unit entity to response
// @param: unit tb.Unit
// @return: model.UnitResponse
func MapUnitEntityToResponse(unit *tb.Unit) model.UnitResponse {
	return model.UnitResponse{
		UnitID: unit.ID,
	}
}

// @author: LoanTT
// @function: mapCreateRequestToEntity
// @description: Mapping create unit request to unit entity
// @param: reqBody *model.CreateUnitRequest
// @return: *tb.Unit
func MapCreateRequestToEntity(reqBody *model.CreateUnitRequest) *tb.Unit {
	return &tb.Unit{
		Name:         reqBody.Name,
		OpenTime:     reqBody.OpenTime,
		CloseTime:    reqBody.CloseTime,
		Phone:        reqBody.Phone,
		Description:  reqBody.Description,
		Status:       reqBody.Status,
		ClubID:       reqBody.ClubID,
		Address:      *au.MapCreateRequestToEntity(&reqBody.Address),
		UnitPrice:    upu.MapCreateRequestToEntities(reqBody.UnitPrices),
		UnitServices: usu.MapCreateRequestToEntities(reqBody.UnitServices),
		Media:        mu.MapCreateRequestToEntities(reqBody.Media),
		SportTypes:   stu.MapCreateRequestToEntities(reqBody.SportTypes),
	}
}

// @author: LoanTT
// @function: MapUpdateRequestToEntity
// @description: mapping update fields
// @param: reqBody *model.UpdateUnitRequest
// @return: tb.Unit
func MapUpdateRequestToEntity(reqBody *model.UpdateUnitRequest) tb.Unit {
	var unitUpdate tb.Unit

	if reqBody.Name != nil {
		unitUpdate.Name = *reqBody.Name
	}
	if reqBody.OpenTime != nil {
		unitUpdate.OpenTime = *reqBody.OpenTime
	}
	if reqBody.CloseTime != nil {
		unitUpdate.CloseTime = *reqBody.CloseTime
	}
	if reqBody.Phone != nil {
		unitUpdate.Phone = *reqBody.Phone
	}
	if reqBody.Description != nil {
		unitUpdate.Description = *reqBody.Description
	}
	if reqBody.Status != nil {
		unitUpdate.Status = *reqBody.Status
	}
	if reqBody.Address != nil {
		unitUpdate.Address = au.MapUpdateRequestToEntity(reqBody.Address)
	}
	if reqBody.UnitPrices != nil {
		unitUpdate.UnitPrice = upu.MapUpdateRequestToEntities(*reqBody.UnitPrices)
	}
	if reqBody.UnitServices != nil {
		unitUpdate.UnitServices = usu.MapUpdateRequestToEntities(*reqBody.UnitServices)
	}
	if reqBody.Media != nil {
		unitUpdate.Media = mu.MapUpdateRequestToEntities(*reqBody.Media)
	}
	if reqBody.SportTypes != nil {
		unitUpdate.SportTypes = stu.MapUpdateRequestToEntities(*reqBody.SportTypes)
	}

	return unitUpdate
}
