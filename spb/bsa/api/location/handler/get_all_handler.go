package handler

import (
	"spb/bsa/api/location/model"
	"spb/bsa/api/location/utility"
	"spb/bsa/pkg/logger"
	"spb/bsa/pkg/msg"
	"spb/bsa/pkg/utils"

	"github.com/gofiber/fiber/v3"
)

// GetAll godoc
//
// @summary 		Get all locations api
// @description 	Get all locations api
// @tags 			locations
// @accept  		json
// @produce 		json
// @param 			i query int false 											"Number items on page"
// @param 			p query int false 											"Page number"
// @param			b query string false 										"Order by"
// @param			t query string false 										"Order type"
// @success 		200 {object} utils.JSONResult{data=model.LocationsResponse}	"Get all locations success"
// @failure 		404 {object} utils.JSONResult{}        						"Get all locations failed"
// @router 			/api/v1/locations [get]
func (s *Handler) GetAll(ctx fiber.Ctx) error {
	fctx := utils.FiberCtx{Fctx: ctx}
	reqBody := new(model.GetLocationsRequest)

	pagination := utils.GetPagination(ctx.Queries(), model.ORDER_BY)
	reqBody.Pagination = pagination

	locations, total_location, err := s.service.GetAll(reqBody)
	if err != nil {
		logger.Errorf("error get locations: %v", err)
		return fctx.ErrResponse(msg.SERVER_ERROR)
	}

	locationResponse := utility.MapLocationEntitiesGetToResponse(locations, reqBody, total_location)
	return fctx.JsonResponse(fiber.StatusOK, msg.CODE_GETALL_LOCATION_SUCCESS, locationResponse)
}
