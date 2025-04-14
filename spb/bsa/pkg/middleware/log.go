package middleware

import (
	"encoding/base64"
	"encoding/json"
	"strings"
	"time"

	"spb/bsa/pkg/auth"
	"spb/bsa/pkg/logger"
	"spb/bsa/pkg/msg"
	"spb/bsa/pkg/utils"

	"github.com/gofiber/fiber/v3"
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

		reqBodyBytes := ctx.BodyRaw()
		var reqBodyJson, resBodyJson *string
		if len(reqBodyBytes) > 0 {
			reqBodyJson = ExtractBodyJson(ctx.Request().Header.ContentType(), reqBodyBytes)
		}

		userId := ""
		reqHeader, _ := json.Marshal(ctx.GetReqHeaders())
		claims, _ := auth.GetTokenFromHeader(ctx)
		if claims != nil {
			userId = claims.UserID
		}

		start := time.Now()
		defer func() {
			ip := ctx.IP()
			resBodyBytes := ctx.Response().Body()
			if len(resBodyBytes) > 0 {
				resBodyJson = ExtractBodyJson(ctx.Response().Header.ContentType(), resBodyBytes)
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

func ExtractBodyJson(contentType []byte, bodyByte []byte) *string {
	var bodyJson *string
	if len(bodyByte) > 0 {
		if string(contentType) == "application/json" {
			bodyJson = utils.ToPtr(string(bodyByte))
		} else {
			nonJsonMap := map[string]any{}
			b64Str := base64.StdEncoding.EncodeToString(bodyByte)
			nonJsonMap["requestType"] = string(bodyByte)
			nonJsonMap["base64"] = b64Str
			if jsonBytes, err := json.Marshal(nonJsonMap); err != nil {
				logger.Errorf(msg.ErrMarshalFailed(err))
			} else {
				bodyJson = utils.ToPtr(string(jsonBytes))
			}
		}
	}
	return bodyJson
}
