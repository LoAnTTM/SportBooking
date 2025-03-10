package metadata

import (
	handler "spb/bsa/api/metadata/handler"
	"spb/bsa/api/metadata/service"
	"spb/bsa/pkg/middleware"

	"github.com/gofiber/fiber/v3"

	_ "spb/bsa/pkg/utils"
)

var (
	MetadataService *service.Service
	MetadataHandler *handler.Handler
)

// @author: LoanTT
// @function: LoadModule
// @description: Register metadata routes
// @param: router fiber.Router
// @param: customMiddleware middleware.ICustomMiddleware
func LoadModule(router fiber.Router, customMiddleware middleware.ICustomMiddleware) {
	MetadataService = service.NewService()
	MetadataHandler = handler.NewHandler(MetadataService)

	metadataRoute := router.Group("/api/v1/metadatas")
	metadataRoute.Get("/:key", customMiddleware.CheckAccess("metadata:read"), MetadataHandler.GetByKey)
	metadataRoute.Put("/:key", customMiddleware.CheckAccess("metadata:update"), MetadataHandler.Update)
}
