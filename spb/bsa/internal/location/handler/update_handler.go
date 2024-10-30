package handler

import (
	"spb/bsa/internal/location/model"
	"spb/bsa/internal/location/utility"
	"spb/bsa/pkg/global"
	"spb/bsa/pkg/logger"
	"spb/bsa/pkg/utils"

	"github.com/gofiber/fiber/v3"
)

var ErrUpdateLocationFailed = fiber.NewError(fiber.StatusBadRequest, "update location failed")

// LocationGetAll godoc
//
// @summary 		Update location by id
// @description 	Update location by id
// @tags 			locations
// @accept  		json
// @produce 		json
// @param 			location body model.UpdateLocationRequest true "Location data"
// @success 		200 {object} utils.JSONResult{data=model.LocationResponse}		"Update location by id success"
// @failure 		400 {object} utils.ErrorResult{message=string}      "Update location by id failed"
// @router 			/api/v1/locations/{id} [patch]
func (s *Handler) Update(ctx fiber.Ctx) error {
	var err error
	var locationId string
	reqBody := new(model.UpdateLocationRequest)

	fctx := utils.FiberCtx{Fctx: ctx}
	if err = fctx.ParseJsonToStruct(reqBody, global.SPB_VALIDATOR); err != nil {
		logger.Errorf("error parse json to struct: %v", err)
		return fctx.ErrResponse(ErrUpdateLocationFailed)
	}
	if locationId, err = fctx.ParseUUID("id"); err != nil {
		logger.Errorf("error parse location id: %v", err)
		return fctx.ErrResponse(ErrUpdateLocationFailed)
	}

	locationUpdated, err := s.service.Update(reqBody, locationId)
	if err != nil {
		logger.Errorf("error create location: %v", err)
		return fctx.ErrResponse(ErrUpdateLocationFailed)
	}
	locationResponse := utility.MapLocationEntityToResponse(locationUpdated)

	return fctx.JsonResponse(fiber.StatusOK, locationResponse)
}
