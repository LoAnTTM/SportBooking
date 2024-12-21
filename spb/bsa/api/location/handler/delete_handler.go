package handler

import (
	"spb/bsa/pkg/logger"
	"spb/bsa/pkg/msg"
	"spb/bsa/pkg/utils"

	"github.com/gofiber/fiber/v3"
)

// Delete godoc
//
// @summary 		Delete location api
// @description 	Delete location api
// @tags 			locations
// @accept  		json
// @produce 		json
// @param 			id path string true 			"location id"
// @success 		200 {object} utils.JSONResult{}	"Delete location success"
// @failure 		400 {object} utils.JSONResult{} "Delete location failed"
// @router 			/api/v1/locations/{id} [delete]
func (s *Handler) Delete(ctx fiber.Ctx) error {
	var err error
	var locationId string

	fctx := utils.FiberCtx{Fctx: ctx}
	if locationId, err = fctx.ParseUUID("id"); err != nil {
		logger.Errorf("error parse location id: %v", err)
		return fctx.ErrResponse(msg.DELETE_LOCATION_FAILED)
	}

	err = s.service.Delete(locationId)
	if err != nil {
		logger.Errorf("error delete location: %v", err)
		return fctx.ErrResponse(msg.DELETE_LOCATION_FAILED)
	}
	return fctx.JsonResponse(fiber.StatusOK, msg.CODE_DELETE_LOCATION_SUCCESS)
}
