package handler

import (
	"spb/bsa/internal/location/model"
	"spb/bsa/internal/location/utility"
	"spb/bsa/pkg/global"
	"spb/bsa/pkg/logger"
	"spb/bsa/pkg/utils"

	"github.com/gofiber/fiber/v3"
)

var ErrCreateLocationFailed = fiber.NewError(fiber.StatusBadRequest, "create location failed")

// Create godoc
//
// @summary 		Create location
// @sescription 	Create location
// @tags 			locations
// @accept  		json
// @produce 		json
// @param 			Group body model.CreateLocationRequest true "Create location"
// @success 		200 {object} utils.JSONResult{data=model.LocationsResponse}		"Create location success"
// @failure 		400 {object} utils.ErrorResult{message=string}        			"Create location failed"
// @router 			/api/v1/locations [post]
func (s *Handler) Create(ctx fiber.Ctx) error {
	var err error
	reqBody := new(model.CreateLocationRequest)

	fctx := utils.FiberCtx{Fctx: ctx}
	if err = fctx.ParseJsonToStruct(reqBody, global.SPB_VALIDATOR); err != nil {
		logger.Errorf("error parse json to struct: %v", err)
		return fctx.ErrResponse(ErrCreateLocationFailed)
	}
	locationCreated, err := s.service.Create(reqBody)
	if err != nil {
		logger.Errorf("error create location: %v", err)
		return fctx.ErrResponse(ErrCreateLocationFailed)
	}
	locationsResponse := utility.MapLocationEntitiesToResponse(locationCreated)

	return fctx.JsonResponse(fiber.StatusOK, locationsResponse)
}
