package middleware

import "github.com/gofiber/fiber/v3"

// @author: LoanTT
// @function: ICustomMiddleware
// @description: Custom middleware
// @return: ICustomMiddleware
// @param: ignorePaths []string
type ICustomMiddleware interface {
	CheckJwt(...string) fiber.Handler
	CheckAccess(string) fiber.Handler
	Log() fiber.Handler
}
