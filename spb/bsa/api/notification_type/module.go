package notification_type

import (
	"spb/bsa/api/notification_type/service"
	"spb/bsa/pkg/middleware"

	"github.com/gofiber/fiber/v3"
)

var NotificationTypeService service.IService

func LoadModule(router fiber.Router, customMiddleware middleware.ICustomMiddleware) {
	NotificationTypeService = service.NewService()
}
