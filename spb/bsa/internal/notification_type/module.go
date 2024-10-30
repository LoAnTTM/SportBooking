package notification_type

import (
	"spb/bsa/internal/notification_type/service"
	"spb/bsa/pkg/middleware"

	"github.com/gofiber/fiber/v3"
)

var NotificationTypeService *service.Service

func LoadModule(router fiber.Router, customMiddleware middleware.ICustomMiddleware) {
	NotificationTypeService = service.NewService()
}
