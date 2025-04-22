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
	response := &model.UnitResponse{
		ID:          unit.ID,
		Name:        unit.Name,
		OpenTime:    unit.OpenTime,
		CloseTime:   unit.CloseTime,
		Phone:       unit.Phone,
		Description: unit.Description,
		Status:      unit.Status,
		ClubID:      unit.ClubID,
	}
	if unit.Address != nil {
		response.Address = au.MapAddressEntityToResponse(unit.Address)
	}
	if unit.UnitPrice != nil {
		response.UnitPrices = upu.MapUnitPriceEntitiesToListResponse(unit.UnitPrice)
	}
	if unit.UnitService != nil {
		response.UnitServices = usu.MapUnitServicesEntitiesToListResponse(unit.UnitService)
	}
	if unit.Media != nil {
		response.Media = mu.MapMediaEntitiesToResponse(unit.Media)
	}
	if unit.SportTypes != nil {
		response.SportTypes = stu.MapSportTypeEntitiesToListResponse(unit.SportTypes)
	}

	return response
}

// @author: LoanTT
// @function: MapUnitEntitiesToResponse
// @description: Mapping unit entities to response
// @param: units []*tb.Unit
// @param: reqBody *model.SearchUnitRequest
// @param: total int64
// @return: *model.UnitsResponse
func MapUnitEntitiesToResponse(units []*tb.Unit, reqBody *model.SearchUnitRequest, total int64) *model.UnitsResponse {
	unitResponse := make([]*model.UnitResponse, 0, len(units))
	for _, unit := range units {
		unitResponse = append(unitResponse, MapUnitEntityToResponse(unit))
	}

	response := new(model.UnitsResponse)
	response.Units = unitResponse
	response.Total = len(unitResponse)
	response.Pagination = reqBody.Pagination
	response.Pagination.SetNewUnitPagination(utils.SafeInt64ToInt(total))

	return response
}

func MapUnitEntitiesToResponseWithoutPagination(units []*tb.Unit) *model.UnitsResponse {
	unitResponse := make([]*model.UnitResponse, 0, len(units))
	for _, unit := range units {
		unitResponse = append(unitResponse, MapUnitEntityToResponse(unit))
	}

	response := new(model.UnitsResponse)
	response.Units = unitResponse
	response.Total = len(unitResponse)
	return response
}

// @author: LoanTT
// @function: mapCreateRequestToEntity
// @description: Mapping create unit request to unit entity
// @param: reqBody *model.CreateUnitRequest
// @return: *tb.Unit
func MapCreateRequestToEntity(reqBody *model.CreateUnitRequest) *tb.Unit {
	keywords := MakeKeyword(reqBody.Name, reqBody.Description)
	return &tb.Unit{
		Name:        reqBody.Name,
		NameEn:      utils.VietNameseCharacterToASCII(reqBody.Name),
		OpenTime:    reqBody.OpenTime,
		CloseTime:   reqBody.CloseTime,
		Phone:       reqBody.Phone,
		Description: reqBody.Description,
		Keywords:    keywords,
		Status:      reqBody.Status,
		ClubID:      reqBody.ClubID,
		Address:     au.MapCreateRequestToEntity(reqBody.Address),
		UnitPrice:   upu.MapCreateRequestToEntities(reqBody.UnitPrices),
		UnitService: usu.MapCreateRequestToEntities(reqBody.UnitServices),
		SportTypes:  stu.MapIdsToEntities(reqBody.SportTypes),
	}
}

func MakeKeyword(value ...string) string {
	keywords := strings.ToLower(utils.Join(" ", value...))
	return utils.VietNameseCharacterToASCII(keywords)
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

type TimeRange struct {
	startTime time.Time
	endTime   time.Time
	index     int
}

func MapToAscTimeRange(unitPrices []map[string]interface{}) ([]TimeRange, error) {
	// Convert and sort unit prices by start time
	ranges := make([]TimeRange, len(unitPrices))
	for i, price := range unitPrices {
		start, err := time.Parse("15:04", price["start_time"].(string))
		if err != nil {
			return nil, fmt.Errorf("invalid start time format at index %d: %w", i, err)
		}
		end, err := time.Parse("15:04", price["end_time"].(string))
		if err != nil {
			return nil, fmt.Errorf("invalid end time format at index %d: %w", i, err)
		}
		// Subtract 1 minute from end time
		end = end.Add(-time.Minute)
		ranges[i] = TimeRange{start, end, i}
	}

	sort.Slice(ranges, func(i, j int) bool {
		return ranges[i].startTime.Before(ranges[j].startTime)
	})
	return ranges, nil
}

func TimeRangeBetween(ranges []TimeRange, openTime, closeTime time.Time) error {
	for i, r := range ranges {
		if r.startTime.Before(openTime) || r.endTime.After(closeTime) {
			return fmt.Errorf("price time range at index %d is outside unit operating hours", ranges[i].index)
		}
	}
	return nil
}

func TimeRangeOverlap(ranges []TimeRange) error {
	for i := range len(ranges) - 1 {
		if !ranges[i].endTime.Before(ranges[i+1].startTime) {
			return fmt.Errorf("overlapping time ranges at indices %d and %d", ranges[i].index, ranges[i+1].index)
		}
	}
	return nil
}

func ValidateUnitPriceTime(unitPrices []map[string]interface{}, openTime, closeTime string) error {
	if len(unitPrices) == 0 {
		return nil
	}

	// Convert unit open/close time to time.Time
	unitOpen, err := time.Parse("15:04", openTime)
	if err != nil {
		return fmt.Errorf("invalid unit open time format: %+v", err)
	}
	unitClose, err := time.Parse("15:04", closeTime)
	if err != nil {
		return fmt.Errorf("invalid unit close time format: %+v", err)
	}

	// Check open time must be before close time
	if unitOpen.After(unitClose) {
		return fmt.Errorf("unit open time must be before close time")
	}

	// Convert and sort unit prices by start time
	ranges, err := MapToAscTimeRange(unitPrices)
	if err != nil {
		return err
	}

	// Check if times are within unit operating hours
	err = TimeRangeBetween(ranges, unitOpen, unitClose)
	if err != nil {
		return err
	}

	// Check for overlaps
	err = TimeRangeOverlap(ranges)
	if err != nil {
		return err
	}

	return nil
}

func MapBookedTimeToResponse(bookedTime []model.BookedTime) *model.BookedTimeResponse {
	bookedTimeResponse := new(model.BookedTimeResponse)
	bookedTimeResponse.Total = len(bookedTime)
	bookedTimeResponse.BookedTime = bookedTime
	return bookedTimeResponse
}
