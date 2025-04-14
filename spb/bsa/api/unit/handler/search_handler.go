package handler

import (
	"spb/bsa/api/unit/model"
	"spb/bsa/api/unit/utility"
	"spb/bsa/pkg/msg"
	"spb/bsa/pkg/utils"

	"github.com/gofiber/fiber/v3"
)

// Search godoc
//
// @summary 		Search unit
// @description 	Search unit
// @tags 			units
// @accept  		json
// @produce 		json
// @param 			i query int false "Items"
// @param 			p query int false "Page"
// @param 			b query string false "Order by"
// @param 			t query string false "Order type"
// @param 			q query string false "Query"
// @param 			st query string false "Sport type"
// @param 			pv query string false "Province"
// @param 			wd query string false "Ward"
// @param 			dt query string false "District"
// @param 			lng query float false "Longitude"
// @param 			lat query float false "Latitude"
// @success 		200 {object} utils.JSONResult{data=[]model.UnitResponse}	"Search unit success"
// @failure 		400 {object} utils.JSONResult{}      						"Search unit failed"
// @router 			/api/v1/units [get]
func (h *Handler) Search(ctx fiber.Ctx) error {
	var err error
	fctx := utils.FiberCtx{Fctx: ctx}
	reqBody := new(model.SearchUnitRequest)

	pagination := model.GetPagination(ctx.Queries())
	reqBody.Pagination = pagination

	units, total, err := h.service.Search(reqBody)
	if err != nil {
		return fctx.ErrResponse(msg.NOT_FOUND)
	}

	response := utility.MapUnitEntitiesToResponse(units, reqBody, total)
	return fctx.JsonResponse(fiber.StatusOK, msg.CODE_SUCCESS, response)
}
