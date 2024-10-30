package handler

import (
	"spb/bsa/internal/metadata/model"
	"spb/bsa/internal/metadata/utility"
	"spb/bsa/pkg/global"
	"spb/bsa/pkg/logger"
	"spb/bsa/pkg/utils"

	"github.com/gofiber/fiber/v3"
)

var ErrUpdateMetadataFailed = fiber.NewError(fiber.StatusBadRequest, "update metadata failed")

// MetadataGetAll godoc
//
// @Summary 		Update metadata by key
// @Description 	Update metadata by key
// @Tags 			metadatas
// @Accept  		json
// @Produce 		json
// @Param 			metadata body model.UpdateMetadataRequest true "Metadata data"
// @Success 		200 {object} utils.JSONResult{data=model.MetadataResponse}		"Update metadata by key success"
// @Failure 		400 {object} utils.ErrorResult{message=string}      			"Update metadata by key failed"
// @Router 			/api/v1/metadatas [patch]
func (s *Handler) Update(ctx fiber.Ctx) error {
	reqBody := new(model.UpdateMetadataRequest)

	fctx := utils.FiberCtx{Fctx: ctx}
	if err := fctx.ParseJsonToStruct(reqBody, global.SPB_VALIDATOR); err != nil {
		logger.Errorf("error parse json to struct: %v", err)
		return fctx.ErrResponse(ErrUpdateMetadataFailed)
	}

	metadataUpdated, err := s.service.Update(reqBody)
	if err != nil {
		logger.Errorf("error create metadata: %v", err)
		return fctx.ErrResponse(ErrUpdateMetadataFailed)
	}
	metadataResponse := utility.MapMetadataEntityToResponse(metadataUpdated)

	return fctx.JsonResponse(fiber.StatusOK, metadataResponse)
}
