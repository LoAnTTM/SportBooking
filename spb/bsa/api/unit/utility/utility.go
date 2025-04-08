package utility

import (
	"fmt"
	"sort"
	"strings"
	"time"

	au "spb/bsa/api/address/utility"
	mu "spb/bsa/api/media/utility"
	stu "spb/bsa/api/sport_type/utility"
	"spb/bsa/api/unit/model"
	upu "spb/bsa/api/unit_price/utility"
	usu "spb/bsa/api/unit_service/utility"
	tb "spb/bsa/pkg/entities"
	"spb/bsa/pkg/utils"
)

// @author: LoanTT
// @function: MapUnitEntityToResponse
// @description: Mapping unit entity to response
// @param: unit tb.Unit
// @return: *model.UnitResponse
func MapUnitEntityToResponse(unit *tb.Unit) *model.UnitResponse {
	return &model.UnitResponse{
		UnitID:       unit.ID,
		Name:         unit.Name,
		OpenTime:     unit.OpenTime,
		CloseTime:    unit.CloseTime,
		Phone:        unit.Phone,
		Description:  unit.Description,
		Status:       unit.Status,
		ClubID:       unit.ClubID,
		Address:      au.MapAddressEntityToResponse(unit.Address),
		UnitPrices:   upu.MapUnitPriceEntitiesToListResponse(unit.UnitPrice),
		UnitServices: usu.MapUnitServicesEntitiesToListResponse(unit.UnitService),
		Media:        mu.MapMediaEntitiesToResponse(unit.Media),
		SportTypes:   stu.MapSportTypeEntitiesToListResponse(unit.SportTypes),
	}
}

// @author: LoanTT
// @function: MapUnitEntitiesToResponse
// @description: Mapping unit entities to response
// @param: units []*tb.Unit
// @param: reqBody *model.SearchUnitRequest
// @param: total int64
// @return: *model.UnitsResponse
func MapUnitEntitiesToResponse(units []*tb.Unit, reqBody *model.SearchUnitRequest, total int64) *model.UnitsResponse {
	unitResponse := make([]*model.UnitResponse, 0)
	for _, unit := range units {
		unitResponse = append(unitResponse, MapUnitEntityToResponse(unit))
	}

	response := new(model.UnitsResponse)
	response.Units = unitResponse
	response.Total = len(unitResponse)
	response.Pagination = reqBody.Pagination
	response.Pagination.SetNewPagination(utils.SafeInt64ToInt(total))

	return response
}

// @author: LoanTT
// @function: mapCreateRequestToEntity
// @description: Mapping create unit request to unit entity
// @param: reqBody *model.CreateUnitRequest
// @return: *tb.Unit
func MapCreateRequestToEntity(reqBody *model.CreateUnitRequest) *tb.Unit {
	return &tb.Unit{
		Name:        reqBody.Name,
		NameEn:      utils.VietNameseCharacterToASCII(reqBody.Name),
		OpenTime:    reqBody.OpenTime,
		CloseTime:   reqBody.CloseTime,
		Phone:       reqBody.Phone,
		Description: reqBody.Description,
		Status:      reqBody.Status,
		ClubID:      reqBody.ClubID,
		Address:     au.MapCreateRequestToEntity(reqBody.Address),
		UnitPrice:   upu.MapCreateRequestToEntities(reqBody.UnitPrices),
		UnitService: usu.MapCreateRequestToEntities(reqBody.UnitServices),
		SportTypes:  stu.MapIdsToEntities(reqBody.SportTypes),
	}
}

// @author: LoanTT
// @function: MapUpdateRequestToEntity
// @description: mapping update fields
// @param: reqBody *model.UpdateUnitRequest
// @return: map[string]interface{}
func MapUpdateRequestToEntity(reqBody *model.UpdateUnitRequest) map[string]interface{} {
	unitUpdate := make(map[string]interface{})

	// Trim and check non-empty strings
	if trimmed := strings.TrimSpace(reqBody.Name); trimmed != "" {
		unitUpdate["name"] = trimmed
		unitUpdate["name_en"] = utils.VietNameseCharacterToASCII(trimmed)
	}
	if trimmed := strings.TrimSpace(reqBody.OpenTime); trimmed != "" {
		unitUpdate["open_time"] = trimmed
	}
	if trimmed := strings.TrimSpace(reqBody.CloseTime); trimmed != "" {
		unitUpdate["close_time"] = trimmed
	}
	if trimmed := strings.TrimSpace(reqBody.Phone); trimmed != "" {
		unitUpdate["phone"] = trimmed
	}
	if trimmed := strings.TrimSpace(reqBody.Description); trimmed != "" {
		unitUpdate["description"] = trimmed
	}
	if reqBody.Status != nil {
		unitUpdate["status"] = *reqBody.Status
	}

	return unitUpdate
}

func ValidateUnitPriceTime(unitPrices []map[string]interface{}, openTime, closeTime string) error {
	if len(unitPrices) == 0 {
		return nil
	}

	// Convert unit open/close time to time.Time
	unitOpen, err := time.Parse("15:04", openTime)
	if err != nil {
		return fmt.Errorf("invalid unit open time format: %w", err)
	}
	unitClose, err := time.Parse("15:04", closeTime)
	if err != nil {
		return fmt.Errorf("invalid unit close time format: %w", err)
	}

	// Convert and sort unit prices by start time
	type timeRange struct {
		startTime time.Time
		endTime   time.Time
		index     int
	}

	ranges := make([]timeRange, len(unitPrices))
	for i, price := range unitPrices {
		start, err := time.Parse("15:04", price["start_time"].(string))
		if err != nil {
			return fmt.Errorf("invalid start time format at index %d: %w", i, err)
		}
		end, err := time.Parse("15:04", price["end_time"].(string))
		if err != nil {
			return fmt.Errorf("invalid end time format at index %d: %w", i, err)
		}
		// Subtract 1 minute from end time
		end = end.Add(-time.Minute)
		ranges[i] = timeRange{start, end, i}
	}

	// Sort by start time
	sort.Slice(ranges, func(i, j int) bool {
		return ranges[i].startTime.Before(ranges[j].startTime)
	})

	// Check if times are within unit operating hours
	for i, r := range ranges {
		if r.startTime.Before(unitOpen) || r.endTime.After(unitClose) {
			return fmt.Errorf("price time range at index %d is outside unit operating hours", ranges[i].index)
		}
	}

	// Check for overlaps
	for i := range len(ranges) - 1 {
		if !ranges[i].endTime.Before(ranges[i+1].startTime) {
			return fmt.Errorf("overlapping time ranges at indices %d and %d",
				ranges[i].index, ranges[i+1].index)
		}
	}

	return nil
}
