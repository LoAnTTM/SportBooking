package handler

import (
	"spb/bsa/api/metadata/model"
	"spb/bsa/api/metadata/utility"
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
		logger.Errorf("error parse json to struct: %v", err)
		return fctx.ErrResponse(msg.METADATA_INCORRECT)
	}

	key := fctx.ParseParam("key")
	metadataUpdated, err := s.service.Update(key, reqBody)
	if err != nil {
		logger.Errorf("error create metadata: %v", err)
		return fctx.ErrResponse(msg.UPDATE_METADATA_FAILED)
	}
	metadataResponse := utility.MapMetadataEntityToResponse(metadataUpdated)

	return fctx.JsonResponse(fiber.StatusOK, msg.CODE_UPDATE_METADATA_SUCCESS, metadataResponse)
}
