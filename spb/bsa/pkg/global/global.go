package global

import (
	"spb/bsa/pkg/config"
	"spb/bsa/pkg/notification"

	"github.com/go-playground/validator/v10"
	"github.com/gofiber/storage/redis/v3"
	"gorm.io/gorm"
)

var (
	SPB_CONFIG    *config.Config
	SPB_DB        *gorm.DB
	SPB_VALIDATOR *validator.Validate
	SPB_REDIS     *redis.Storage
	SPB_NOTIFY    *notification.Notification
)

// @author: LoanTT
// @function: IsProd
// @description: check env is production
// @return: bool
func IsProd() bool {
	return SPB_CONFIG.Server.Env == "production"
}

// @author: LoanTT
// @function: IsDev
// @description: check env is development
// @return: bool
func IsDev() bool {
	return SPB_CONFIG.Server.Env == "development"
}
