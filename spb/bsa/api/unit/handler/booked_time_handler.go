package handler

import (
	"spb/bsa/api/unit/model"
	"spb/bsa/api/unit/utility"
	"spb/bsa/pkg/global"
	"spb/bsa/pkg/logger"
	"spb/bsa/pkg/msg"
	"spb/bsa/pkg/utils"

	"github.com/gofiber/fiber/v3"
)

// BookedTimeOnDay godoc
//
// @summary 		Get booked time on day
// @description 	Get booked time on day
// @tags 			units
// @accept  		json
// @produce 		json
// @param 			id path string true "Unit ID"
// @param 			BookedTimeRequest body model.BookedTimeRequest true "Booked time request"
// @success 		200 {object} utils.JSONResult{data=[]model.BookedTimeResponse} "Get booked time on day success"
// @failure 		400 {object} utils.JSONResult{} "Get booked time on day failed"
// @router 			/api/v1/units/{id}/booked-time [post]
func (h *Handler) BookedTimeOnDay(ctx fiber.Ctx) error {
	var err error
	var bookedTime []model.BookedTime
	var unitId string
	reqBody := new(model.BookedTimeRequest)

	fctx := utils.FiberCtx{Fctx: ctx}
	if err = fctx.ParseJsonToStruct(reqBody, global.SPB_VALIDATOR); err != nil {
		logger.Errorf(msg.ErrParseStructFailed("BookedTimeRequest", err))
		return fctx.ErrResponse(msg.REQUEST_BODY_INVALID)
	}

	if unitId, err = fctx.ParseUUID("id"); err != nil {
		logger.Errorf(msg.ErrParseUUIDFailed("unit", err))
		return fctx.ErrResponse(msg.PARAM_INVALID)
	}

	if bookedTime, err = h.service.BookedTimeOnDay(reqBody, unitId); err != nil {
		logger.Errorf(msg.ErrGetFailed("order", err))
		switch err {
		case msg.ErrUnitNotFound:
			return fctx.ErrResponse(msg.UNIT_NOT_FOUND)
		default:
			return fctx.ErrResponse(msg.BAD_REQUEST)
		}
	}

	response := utility.MapBookedTimeToResponse(bookedTime)
	return fctx.JsonResponse(fiber.StatusOK, msg.CODE_SUCCESS, response)
}
