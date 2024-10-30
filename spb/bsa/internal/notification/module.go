package notification

import (
	handler "spb/bsa/internal/notification/handler"
	"spb/bsa/internal/notification/service"
	"spb/bsa/pkg/middleware"
	_ "spb/bsa/pkg/utils"

	"github.com/gofiber/fiber/v3"
)

var (
	NotificationService *service.Service
	NotificationHandler *handler.Handler
)

// @author: LoanTT
// @function: LoadModule
// @description: Register notification routes
// @param: router fiber.Router
// @param: customMiddleware middleware.ICustomMiddleware
func LoadModule(router fiber.Router, customMiddleware middleware.ICustomMiddleware) {
	NotificationService = service.NewService()
	NotificationHandler = handler.NewHandler(NotificationService)

	notificationRoute := router.Group("/api/v1/notifications")
	notificationRoute.Post("/sender", NotificationHandler.GetBySender, customMiddleware.CheckAccess("notification:list"))
	notificationRoute.Post("/receiver", NotificationHandler.GetByReceiver, customMiddleware.CheckAccess("notification:list"))
}
