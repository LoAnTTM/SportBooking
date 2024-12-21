package handler

import (
	"spb/bsa/pkg/logger"
	"spb/bsa/pkg/msg"
	"spb/bsa/pkg/utils"

	"github.com/gofiber/fiber/v3"
)

// Delete godoc
//
// @summary 		Delete unit service
// @description 	Delete unit service
// @tags 			unit-services
// @accept  		json
// @produce 		json
// @param 			id path string true "unit service id"
// @success 		200 {object} utils.JSONResult{message=string}		"Delete unit service success"
// @failure 		400 {object} utils.JSONResult{}      "Delete unit service failed"
// @router 			/api/v1/unit-services/{id} [delete]
func (s *Handler) Delete(ctx fiber.Ctx) error {
	var err error
	var unitServiceId string

	fctx := utils.FiberCtx{Fctx: ctx}
	if unitServiceId, err = fctx.ParseUUID("id"); err != nil {
		logger.Errorf("error parse unit_service id: %v", err)
		return fctx.ErrResponse(msg.DELETE_UNIT_SERVICE_FAILED)
	}

	err = s.service.Delete(unitServiceId)
	if err != nil {
		logger.Errorf("error delete unit_service: %v", err)
		return fctx.ErrResponse(msg.DELETE_UNIT_SERVICE_FAILED)
	}

	return fctx.JsonResponse(fiber.StatusOK, msg.CODE_DELETE_UNITSERVICE_SUCCESS)
}
