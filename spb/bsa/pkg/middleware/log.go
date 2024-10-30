package middleware

import (
	"encoding/base64"
	"encoding/json"
	"strings"
	"time"

	"spb/bsa/pkg/auth"
	"spb/bsa/pkg/logger"
	"spb/bsa/pkg/utils"

	"github.com/gofiber/fiber/v3"
	"github.com/golang-jwt/jwt/v5"
)

var excludeLogRoutes = []string{}

// @author: LoanTT
// @function: LogMiddleware
// @description: Log middleware
func LogMiddleware() fiber.Handler {
	return func(ctx fiber.Ctx) error {
		for _, route := range excludeLogRoutes {
			if strings.Contains(ctx.Request().URI().String(), route) {
				return ctx.Next()
			}
		}

		bodyBytes := ctx.BodyRaw()
		var reqBodyJson, resBodyJson *string
		if len(bodyBytes) > 0 {
			if string(ctx.Request().Header.ContentType()) == "application/json" {
				reqBodyJson = utils.ToPtr(string(bodyBytes))
			} else {
				nonJsonMap := map[string]interface{}{}
				b64Str := base64.StdEncoding.EncodeToString(bodyBytes)
				nonJsonMap["requestType"] = string(ctx.Request().Header.ContentType())
				nonJsonMap["base64"] = b64Str
				if jsonBytes, err := json.Marshal(nonJsonMap); err != nil {
					logger.Errorf("failed to marshal nonJsonMap, err: %s", err.Error())
				} else {
					reqBodyJson = utils.ToPtr(string(jsonBytes))
				}
			}
		}

		reqHeader, _ := json.Marshal(ctx.GetReqHeaders())

		var userId interface{}
		var claims jwt.MapClaims
		claims, _ = auth.GetTokenFromHeader(ctx)

		if len(claims) > 0 {
			userId = claims["userId"]
		}

		start := time.Now()
		defer func() {
			ip := ctx.IP()
			if len(ctx.Response().Body()) > 0 {
				if string(ctx.Response().Header.ContentType()) == "application/json" {
					resBodyJson = utils.ToPtr(string(ctx.Response().Body()))
				} else {
					nonJsonMap := map[string]interface{}{}
					b64Str := base64.StdEncoding.EncodeToString(ctx.Response().Body())
					nonJsonMap["responseType"] = string(ctx.Response().Header.ContentType())
					nonJsonMap["base64"] = b64Str
					if jsonBytes, err := json.Marshal(nonJsonMap); err != nil {
						logger.Errorf("failed to marshal nonJsonMap, err: %s", err.Error())
					} else {
						resBodyJson = utils.ToPtr(string(jsonBytes))
					}
				}
			}

			// create log to files
			logger.SysLog("SPORT BOOKING LOG",
				logger.GetField("UserId", userId),
				logger.GetField("IpAddress", ip),
				logger.GetField("HttpMethod", ctx.Method()),
				logger.GetField("Route", ctx.Request().URI().String()),
				logger.GetField("UserAgent", (ctx.Request().Header.UserAgent())),
				logger.GetField("RequestHeader", (reqHeader)),
				logger.GetField("RequestBody", reqBodyJson),
				logger.GetField("ResponseBody", resBodyJson),
				logger.GetField("Status", int64(ctx.Response().StatusCode())),
				logger.GetField("Duration", time.Since(start).Milliseconds()),
			)
		}()
		return ctx.Next()
	}
}
