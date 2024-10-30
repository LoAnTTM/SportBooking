package handler

import (
	"spb/bsa/internal/location/utility"
	"spb/bsa/pkg/logger"
	"spb/bsa/pkg/utils"

	"github.com/gofiber/fiber/v3"
)

var ErrGetLocationsFailed = fiber.NewError(fiber.StatusNotFound, "get locations failed")

// GetAll godoc
//
// @summary 		Get all locations
// @description 	Get all locations
// @tags 			locations
// @accept  		json
// @produce 		json
// @param 			i query int false "Number items on page"
// @param 			p query int false "Page number"
// @param			b query string false "Order by"
// @param			t query string false "Order type"
// @success 		200 {object} utils.JSONResult{data=model.LocationsResponse}	"Get all locations success"
// @failure 		404 {object} utils.ErrorResult{message=string}        		"Get all locations failed"
// @router 			/api/v1/locations [get]
func (s *Handler) GetAll(ctx fiber.Ctx) error {
	fctx := utils.FiberCtx{Fctx: ctx}

	locations, err := s.service.GetAll()
	if err != nil {
		logger.Errorf("error get locations: %v", err)
		return fctx.ErrResponse(ErrGetLocationsFailed)
	}

	locationResponse := utility.MapLocationEntitiesToResponse(locations)
	return fctx.JsonResponse(fiber.StatusOK, locationResponse)
}
