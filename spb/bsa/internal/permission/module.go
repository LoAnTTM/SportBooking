package permission

import (
	"spb/bsa/internal/permission/service"
	"spb/bsa/pkg/middleware"

	"github.com/gofiber/fiber/v3"
)

var PermissionService *service.Service

// @author: LoanTT
// @function: LoadModule
// @description: Register user routes
// @param: router fiber.Router
// @param: customMiddleware middleware.ICustomMiddleware
func LoadModule(router fiber.Router, customMiddleware middleware.ICustomMiddleware) {
	PermissionService = service.NewService()
}

// @author: LoanTT
// @function: GetPermissions
// @description: Get all permissions
// @return: map[string]uint64
func GetPermissions() (map[string]uint64, error) {
	permissionsEntity, err := PermissionService.GetAll()
	if err != nil {
		return nil, err
	}

	result := make(map[string]uint64)
	for _, permission := range permissionsEntity {
		result[permission.Name] = permission.ID
	}
	return result, nil
}
