package handler

import (
	"spb/bsa/api/metadata/utility"
	"spb/bsa/pkg/logger"
	"spb/bsa/pkg/msg"
	"spb/bsa/pkg/utils"

	tb "spb/bsa/pkg/entities"

	"github.com/gofiber/fiber/v3"
)

// GetAll godoc
//
// @summary 		Get metadata by key
// @description 	Get metadata by key
// @tags 			metadatas
// @accept  		json
// @produce 		json
// @param 			key path string true 			"Metadata Key"
// @success 		200 {object} utils.JSONResult{}	"Get metadata by key success"
// @failure 		400 {object} utils.JSONResult{} "Get metadata by key failed"
// @router 			/api/v1/metadatas/{key}  [get]
func (s *Handler) GetByKey(ctx fiber.Ctx) error {
	var err error
	var metadataKey string
	var metadata *tb.Metadata

	fctx := utils.FiberCtx{Fctx: ctx}
	metadataKey = fctx.ParseParam("key")

	if metadata, err = s.service.GetByKey(metadataKey); err != nil {
		logger.Errorf(msg.ErrGetFailed("metadata", err))
		return fctx.ErrResponse(msg.NOT_FOUND)
	}

	metadataResponse := utility.MapMetadataEntityToResponse(metadata)
	return fctx.JsonResponse(fiber.StatusOK, msg.CODE_SUCCESS, metadataResponse)
}
