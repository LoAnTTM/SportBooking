package handler

import (
	"spb/bsa/api/unit_service/utility"
	"spb/bsa/pkg/logger"
	"spb/bsa/pkg/msg"
	"spb/bsa/pkg/utils"

	tb "spb/bsa/pkg/entities"

	"github.com/gofiber/fiber/v3"
)

// GetByID godoc
//
// @summary 		Get unit service by id
// @description 	Get unit service by id
// @tags 			unit-services
// @accept  		json
// @produce 		json
// @param 			id path string true 			"Unit service id"
// @success 		200 {object} utils.JSONResult{}	"Get unit service by id success"
// @failure 		400 {object} utils.JSONResult{} "Get unit service by id failed"
// @router 			/api/v1/unit-services/{id} [get]
func (s *Handler) GetByID(ctx fiber.Ctx) error {
	var err error
	var unitServiceId string
	var unitService *tb.UnitService

	fctx := utils.FiberCtx{Fctx: ctx}
	if unitServiceId, err = fctx.ParseUUID("id"); err != nil {
		logger.Errorf("error parse unitService id: %v", err)
		return fctx.ErrResponse(msg.GET_UNIT_SERVICE_FAILED)
	}

	if unitService, err = s.service.GetByID(unitServiceId); err != nil {
		logger.Errorf("error get unitService by id: %v", err)
		return fctx.ErrResponse(msg.UNIT_SERVICE_NOTFOUND)
	}

	unitServiceResponse := utility.MapUnitServiceEntityToResponse(unitService)
	return fctx.JsonResponse(fiber.StatusOK, msg.CODE_GET_UNITSERVICE_SUCCESS, unitServiceResponse)
}
