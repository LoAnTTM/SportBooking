package auth

import (
	handler "spb/bsa/internal/auth/handler"
	"spb/bsa/internal/auth/service"
	"spb/bsa/pkg/middleware"

	"github.com/gofiber/fiber/v3"
)

var (
	AuthService *service.Service
	AuthHandler *handler.Handler
)

// @author: LoanTT
// @function: LoadModule
// @description: Register auth routes
// @param: router fiber.Router
// @param: customMiddleware middleware.ICustomMiddleware
func LoadModule(router fiber.Router, customMiddleware middleware.ICustomMiddleware) {
	AuthService = service.NewService()
	AuthHandler = handler.NewHandler(AuthService)

	authRoute := router.Group("/api/v1/auth")
	authRoute.Post("/login", AuthHandler.AccountLogin)
	authRoute.Post("/register", AuthHandler.AccountRegister)
	authRoute.Post("/refresh", AuthHandler.AccountRefreshToken)
	authRoute.Get("/verify-email", AuthHandler.VerifyEmail)
}
