package handler

import (
	"spb/bsa/api/metadata/model"
	"spb/bsa/pkg/global"
	"spb/bsa/pkg/logger"
	"spb/bsa/pkg/msg"
	"spb/bsa/pkg/utils"

	"github.com/gofiber/fiber/v3"
)

var ErrUpdateMetadataFailed = fiber.NewError(fiber.StatusBadRequest, "update metadata failed")

// Update godoc
//
// @summary 		Update metadata by key
// @description 	Update metadata by key
// @tags 			metadatas
// @accept  		json
// @produce 		json
// @param 			metadata body model.UpdateMetadataRequest true 				"Metadata data"
// @success 		200 {object} utils.JSONResult{data=model.MetadataResponse}	"Update metadata by key success"
// @failure 		400 {object} utils.JSONResult{}      						"Update metadata by key failed"
// @router 			/api/v1/metadatas/{key} [put]
func (s *Handler) Update(ctx fiber.Ctx) error {
	reqBody := new(model.UpdateMetadataRequest)

	fctx := utils.FiberCtx{Fctx: ctx}
	if err := fctx.ParseJsonToStruct(reqBody, global.SPB_VALIDATOR); err != nil {
		logger.Errorf(msg.ErrParseStructFailed("UpdateMetadataRequest", err))
		return fctx.ErrResponse(msg.REQUEST_BODY_INVALID)
	}

	key := fctx.ParseParam("key")
	if err := s.service.Update(key, reqBody); err != nil {
		logger.Errorf(msg.ErrUpdateFailed("metadata", err))
		return fctx.ErrResponse(msg.BAD_REQUEST)
	}

	return fctx.JsonResponse(fiber.StatusOK, msg.CODE_SUCCESS)
}
