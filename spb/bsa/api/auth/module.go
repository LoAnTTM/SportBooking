package auth

import (
	handler "spb/bsa/api/auth/handler"
	"spb/bsa/api/auth/service"
	"spb/bsa/pkg/global"
	"spb/bsa/pkg/middleware"

	"github.com/gofiber/fiber/v3"
)

var (
	AuthService service.IService
	AuthHandler handler.IHandler
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
	authRoute.Post("/logout", AuthHandler.AccountLogout)
	authRoute.Post("/refresh", AuthHandler.AccountRefreshToken)
	authRoute.Post("/verify-register-token", AuthHandler.VerifyRegisterToken)
	authRoute.Post("/verify-register-token/resend", AuthHandler.ResendVerifyRegisterToken)
	authRoute.Post("/forgot-password", AuthHandler.ForgotPasswordHandler)
	authRoute.Post("/verify-forgot-password-token", AuthHandler.VerifyForgotPasswordToken)
	authRoute.Post("/reset-password", AuthHandler.ResetPassword)

	// aws ses verify
	authRoute.Get(("/ses-verify"), AuthHandler.SendVerification, customMiddleware.CheckAccess("auth:aws"))

	// google oauth callback
	router.Post(global.SPB_CONFIG.OAuth.Google.Callback, AuthHandler.GoogleCallback)
}
