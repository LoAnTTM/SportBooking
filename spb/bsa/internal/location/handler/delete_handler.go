package handler

import (
	"spb/bsa/pkg/logger"
	"spb/bsa/pkg/utils"

	"github.com/gofiber/fiber/v3"
)

var ErrDeleteLocationFailed = fiber.NewError(fiber.StatusBadRequest, "delete location failed")

// Delete godoc
//
// @summary 		Delete location
// @description 	Delete location
// @tags 			locations
// @accept  		json
// @produce 		json
// @param 			id path string true "location id"
// @success 		200 {object} utils.JSONResult{message=string}		"Delete location success"
// @failure 		400 {object} utils.ErrorResult{message=string}      "Delete location failed"
// @router 			/api/v1/locations/{id} [delete]
func (s *Handler) Delete(ctx fiber.Ctx) error {
	var err error
	var locationId string

	fctx := utils.FiberCtx{Fctx: ctx}
	if locationId, err = fctx.ParseUUID("id"); err != nil {
		logger.Errorf("error parse location id: %v", err)
		return fctx.ErrResponse(ErrDeleteLocationFailed)
	}

	err = s.service.Delete(locationId)
	if err != nil {
		logger.Errorf("error delete location: %v", err)
		return fctx.ErrResponse(ErrDeleteLocationFailed)
	}
	return fctx.JsonResponse(fiber.StatusOK, "delete location success")
}
