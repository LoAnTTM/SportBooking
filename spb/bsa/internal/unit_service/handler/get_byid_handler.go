package handler

import (
	"spb/bsa/internal/unit_service/utility"
	"spb/bsa/pkg/logger"
	"spb/bsa/pkg/utils"

	tb "spb/bsa/pkg/entities"

	"github.com/gofiber/fiber/v3"
)

var (
	ErrGetUnitServiceFailed = fiber.NewError(fiber.StatusBadRequest, "error get unitService")
	ErrUnitServiceNotFound  = fiber.NewError(fiber.StatusNotFound, "unitService not found")
)

// GetByID godoc
//
// @summary 		Get unitService by id
// @description 	Get unitService by id
// @tags 			unit-services
// @accept  		json
// @produce 		json
// @param 			id path string true "UnitService ID"
// @success 		200 {object} utils.JSONResult{message=string}		"Get unitService by id success"
// @failure 		400 {object} utils.ErrorResult{message=string}      "Get unitService by id failed"
// @router 			/api/v1/unit-services/{id} [delete]
func (s *Handler) GetByID(ctx fiber.Ctx) error {
	var err error
	var unitServiceId string
	var unitService *tb.UnitService

	fctx := utils.FiberCtx{Fctx: ctx}
	if unitServiceId, err = fctx.ParseUUID("id"); err != nil {
		logger.Errorf("error parse unitService id: %v", err)
		return fctx.ErrResponse(ErrGetUnitServiceFailed)
	}

	if unitService, err = s.service.GetByID(unitServiceId); err != nil {
		logger.Errorf("error get unitService by id: %v", err)
		return fctx.ErrResponse(ErrUnitServiceNotFound)
	}

	unitServiceResponse := utility.MapUnitServiceEntityToResponse(unitService)
	return fctx.JsonResponse(fiber.StatusOK, unitServiceResponse)
}
