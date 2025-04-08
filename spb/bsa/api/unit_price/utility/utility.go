package utility

import (
	"strings"

	"spb/bsa/api/unit_price/model"
	tb "spb/bsa/pkg/entities"

	"gorm.io/gorm"
)

// @author: LoanTT
// @function: Map unitPrice entity to response
// @description: Return unitPrice response
// @return: model.UnitPriceResponse
func MapUnitPriceEntityToResponse(unitPrice *tb.UnitPrice) *model.UnitPriceResponse {
	return &model.UnitPriceResponse{
		ID:        unitPrice.ID,
		Price:     unitPrice.Price,
		Currency:  unitPrice.Currency,
		StartTime: unitPrice.StartTime,
		EndTime:   unitPrice.EndTime,
	}
}

// @author: LoanTT
// @function: MapUnitPriceEntitiesToResponse
// @description: Map unit_prices entity to response
// @param: unit_prices []*tb.UnitPrice
// @return: *model.UnitPricesResponse
func MapUnitPriceEntitiesToResponse(unit_prices []*tb.UnitPrice, reqBody *model.GetUnitPricesRequest) *model.UnitPricesResponse {
	res := new(model.UnitPricesResponse)
	for id := range unit_prices {
		res.UnitPrices = append(res.UnitPrices, *MapUnitPriceEntityToResponse(unit_prices[id]))
	}

	unitPriceNum := len(res.UnitPrices)
	res.Total = uint(unitPriceNum)
	res.Pagination = reqBody.Pagination
	res.Pagination.SetNewPagination(unitPriceNum)
	return res
}

// @author: LoanTT
// @function: MapCreateRequestToEntity
// @description: Mapping create unitPrice request to unitPrice entity
// @param: reqBody *model.CreateUnitPriceRequest
// @return: *tb.UnitPrice
func MapCreateRequestToEntity(reqBody *model.CreateUnitPriceRequest) *tb.UnitPrice {
	return &tb.UnitPrice{
		Price:     reqBody.Price,
		Currency:  reqBody.Currency,
		StartTime: reqBody.StartTime,
		EndTime:   reqBody.EndTime,
	}
}

// @author: LoanTT
// @function: MapCreateRequestToEntities
// @description: Mapping create unitPrice requests to unitPrice entities
// @param: reqBody []model.CreateUnitPriceRequest
// @return: []tb.UnitPrice
func MapCreateRequestToEntities(reqBody []*model.CreateUnitPriceRequest) []*tb.UnitPrice {
	unitPrices := make([]*tb.UnitPrice, 0)

	for id := range reqBody {
		unitPrices = append(unitPrices, MapCreateRequestToEntity(reqBody[id]))
	}
	return unitPrices
}

// @author: LoanTT
// @function: MapUpdateRequestToEntity
// @description: mapping update fields
// @param: reqBody *model.UpdateUnitPriceRequest
// @return: *tb.UnitPrice
func MapUpdateRequestToEntity(reqBody *model.UpdateUnitPriceRequest) *tb.UnitPrice {
	updates := new(tb.UnitPrice)

	if reqBody.Price != nil {
		updates.Price = *reqBody.Price
	}
	if strings.TrimSpace(reqBody.Currency) != "" {
		updates.Currency = strings.TrimSpace(reqBody.Currency)
	}
	if strings.TrimSpace(reqBody.StartTime) != "" {
		updates.StartTime = strings.TrimSpace(reqBody.StartTime)
	}
	if strings.TrimSpace(reqBody.EndTime) != "" {
		updates.EndTime = strings.TrimSpace(reqBody.EndTime)
	}

	return updates
}

// @author: LoanTT
// @function: MapUpdateRequestToEntities
// @description: mapping update fields
// @param: reqBody []model.UpdateUnitPriceRequest
// @return: []tb.UnitPrice
func MapUpdateRequestToEntities(reqBody []model.UpdateUnitPriceRequest) []*tb.UnitPrice {
	unitPrices := make([]*tb.UnitPrice, len(reqBody))
	for id := range reqBody {
		unitPrices[id] = MapUpdateRequestToEntity(&reqBody[id])
	}
	return unitPrices
}

// @author: LoanTT
// @function: OverlappedTime
// @description: Check if time range is overlapped
// @param: startTime, endTime string
// @return: func(*gorm.DB) *gorm.DB
func OverlappedTime(startTime, endTime string) func(*gorm.DB) *gorm.DB {
	return func(db *gorm.DB) *gorm.DB {
		return db.Where("REPLACE(start_time, ':', '.')::FLOAT < REPLACE(?, ':', '.')::FLOAT", endTime).
			Where("REPLACE(?, ':', '.')::FLOAT < REPLACE(end_time, ':', '.')::FLOAT", endTime)
	}
}

func MapUnitPriceEntitiesToListResponse(unitPrices []*tb.UnitPrice) []*model.UnitPriceResponse {
	unitPricesResponse := make([]*model.UnitPriceResponse, len(unitPrices))
	for i, unitPrice := range unitPrices {
		unitPricesResponse[i] = MapUnitPriceEntityToResponse(unitPrice)
	}
	return unitPricesResponse
}

func MapCreateRequestToJSON(unitPrices []*model.CreateUnitPriceRequest) []map[string]interface{} {
	unitPricesJSON := make([]map[string]interface{}, len(unitPrices))
	for i, unitPrice := range unitPrices {
		unitPricesJSON[i] = map[string]interface{}{
			"price":      unitPrice.Price,
			"currency":   unitPrice.Currency,
			"start_time": unitPrice.StartTime,
			"end_time":   unitPrice.EndTime,
		}
	}
	return unitPricesJSON
}

func MapUpdateRequestToJSON(unitPrices []model.UpdateUnitPriceRequest) []map[string]interface{} {
	unitPricesJSON := make([]map[string]interface{}, len(unitPrices))
	for i, unitPrice := range unitPrices {
		unitPricesJSON[i] = map[string]interface{}{
			"price":      unitPrice.Price,
			"currency":   unitPrice.Currency,
			"start_time": unitPrice.StartTime,
			"end_time":   unitPrice.EndTime,
		}
	}
	return unitPricesJSON
}
