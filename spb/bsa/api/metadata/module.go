package metadata

import (
	handler "spb/bsa/api/metadata/handler"
	"spb/bsa/api/metadata/service"
	"spb/bsa/pkg/middleware"
	_ "spb/bsa/pkg/utils"

	"github.com/gofiber/fiber/v3"
)

var (
	MetadataService service.IService
	MetadataHandler handler.IHandler
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
	metadataRoute.Get("/:key", MetadataHandler.GetByKey, customMiddleware.CheckAccess("metadata:read"))
	metadataRoute.Put("/:key", MetadataHandler.Update, customMiddleware.CheckAccess("metadata:update"))
}
