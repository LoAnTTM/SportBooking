package handler

import (
	"spb/bsa/pkg/logger"
	"spb/bsa/pkg/utils"

	"github.com/gofiber/fiber/v3"
)

var ErrDeleteUnitServiceFailed = fiber.NewError(fiber.StatusBadRequest, "delete unit_service failed")

// Delete godoc
//
// @summary 		Delete unitService
// @description 	Delete unitService
// @tags 			unit-services
// @accept  		json
// @produce 		json
// @param 			id path string true "unitService id"
// @success 		200 {object} utils.JSONResult{message=string}		"Delete unitService success"
// @failure 		400 {object} utils.ErrorResult{message=string}      "Delete unitService failed"
// @router 			/api/v1/unit-services/{id} [delete]
func (s *Handler) Delete(ctx fiber.Ctx) error {
	var err error
	var unitServiceId string

	fctx := utils.FiberCtx{Fctx: ctx}
	if unitServiceId, err = fctx.ParseUUID("id"); err != nil {
		logger.Errorf("error parse unit_service id: %v", err)
		return fctx.ErrResponse(ErrDeleteUnitServiceFailed)
	}

	err = s.service.Delete(unitServiceId)
	if err != nil {
		logger.Errorf("error delete unit_service: %v", err)
		return fctx.ErrResponse(ErrDeleteUnitServiceFailed)
	}
	return fctx.JsonResponse(fiber.StatusOK, nil, "delete unit_service success")
}
