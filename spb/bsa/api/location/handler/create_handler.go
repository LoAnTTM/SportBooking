package handler

import (
	"spb/bsa/api/location/model"
	"spb/bsa/api/location/utility"
	"spb/bsa/pkg/global"
	"spb/bsa/pkg/logger"
	"spb/bsa/pkg/msg"
	"spb/bsa/pkg/utils"

	"github.com/gofiber/fiber/v3"
)

// Create godoc
//
// @summary 		Create location api
// @description 	Create location api
// @tags 			locations
// @accept  		json
// @produce 		json
// @param 			Group body model.CreateLocationRequest true 				"Create location"
// @success 		200 {object} utils.JSONResult{data=model.LocationsResponse}	"Create location success"
// @failure 		400 {object} utils.JSONResult{}        						"Create location failed"
// @router 			/api/v1/locations [post]
func (s *Handler) Create(ctx fiber.Ctx) error {
	var err error
	reqBody := new(model.CreateLocationRequest)

	fctx := utils.FiberCtx{Fctx: ctx}
	if err = fctx.ParseJsonToStruct(reqBody, global.SPB_VALIDATOR); err != nil {
		logger.Errorf("error parse json to struct: %v", err)
		return fctx.ErrResponse(msg.CREATE_LOCATION_FAILED)
	}
	locationCreated, err := s.service.Create(reqBody)
	if err != nil {
		logger.Errorf("error create location: %v", err)
		return fctx.ErrResponse(msg.LOCATION_INCORRECT)
	}

	locationsResponse := utility.MapLocationEntitiesToResponse(locationCreated)
	return fctx.JsonResponse(fiber.StatusOK, msg.CODE_CREATE_LOCATION_SUCCESS, locationsResponse)
}
