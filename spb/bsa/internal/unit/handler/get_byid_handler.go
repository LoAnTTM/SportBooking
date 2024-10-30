package handler

import (
	"spb/bsa/internal/unit/utility"
	"spb/bsa/pkg/auth"
	"spb/bsa/pkg/logger"
	"spb/bsa/pkg/utils"

	tb "spb/bsa/pkg/entities"

	"github.com/gofiber/fiber/v3"
)

var (
	ErrGetUnitFailed = fiber.NewError(fiber.StatusBadRequest, "error get unit")
	ErrUnitNotFound  = fiber.NewError(fiber.StatusNotFound, "unit not found")
)

// GetByID godoc
//
// @summary 		Get unit by id
// @description 	Get unit by id
// @tags 			units
// @accept  		json
// @produce 		json
// @param 			id path string true "Unit ID"
// @success 		200 {object} utils.JSONResult{message=string}		"Get unit by id success"
// @failure 		400 {object} utils.ErrorResult{message=string}      "Get unit by id failed"
// @router 			/api/v1/units/{id} [delete]
func (s *Handler) GetByID(ctx fiber.Ctx) error {
	var err error
	var unitId string
	var unit *tb.Unit

	fctx := utils.FiberCtx{Fctx: ctx}
	claims, err := auth.GetTokenFromCookie(ctx)
	if err != nil {
		logger.Errorf("error parse jwt: %v", err)
		return fctx.ErrResponse(ErrGetUnitFailed)
	}

	if unitId, err = fctx.ParseUUID("id"); err != nil {
		logger.Errorf("error parse unit id: %v", err)
		return fctx.ErrResponse(ErrGetUnitFailed)
	}

	role := claims["role"].(string)
	if unit, err = s.service.GetByID(unitId, role); err != nil {
		logger.Errorf("error get unit by id: %v", err)
		return fctx.ErrResponse(ErrUnitNotFound)
	}

	unitResponse := utility.MapUnitEntityToResponse(unit)
	return fctx.JsonResponse(fiber.StatusOK, unitResponse)
}
