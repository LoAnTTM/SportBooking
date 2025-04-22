package notification

import (
	handler "spb/bsa/api/notification/handler"
	"spb/bsa/api/notification/service"
	"spb/bsa/pkg/middleware"
	_ "spb/bsa/pkg/utils"

	"github.com/gofiber/fiber/v3"
)

var (
	NotificationService service.IService
	NotificationHandler handler.IHandler
)

// @author: LoanTT
// @function: LoadModule
// @description: Register notification routes
// @param: router fiber.Router
// @param: customMiddleware middleware.ICustomMiddleware
func LoadModule(router fiber.Router, customMiddleware middleware.ICustomMiddleware) {
	NotificationService = service.NewService()
	NotificationHandler = handler.NewHandler(NotificationService)

	notificationRoute := router.Group("/api/v1/notifications", customMiddleware.CheckAccess("notification:read"))
	notificationRoute.Get("/sender/:id", NotificationHandler.GetBySender)
	notificationRoute.Get("/receiver/:id", NotificationHandler.GetByReceiver)
}
