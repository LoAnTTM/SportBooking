package utils

import (
	"encoding/json"
	"errors"
	"strconv"

	"spb/bsa/pkg/msg"

	"github.com/go-playground/validator/v10"
	"github.com/gofiber/fiber/v3"
	"github.com/google/uuid"
)

type FlexInt int64

var ErrKeyNotFound = errors.New("key not found")

// @author: LoanTT
// @function: UnmarshalJSON
// @description: Unmarshal JSON
// @param: b []byte
// @return: error
func (fi *FlexInt) UnmarshalJSON(b []byte) error {
	if b[0] != '"' {
		return json.Unmarshal(b, (*int64)(fi))
	}
	var s string
	if err := json.Unmarshal(b, &s); err != nil {
		return err
	}
	i, err := strconv.ParseInt(s, 10, 64)
	if err != nil {
		return err
	}
	*fi = FlexInt(i)
	return nil
}

type Optional[T any] struct {
	Presented bool
	Value     *T
}

// @author: LoanTT
// @function: UnmarshalJSON
// @description: Unmarshal JSON
// @param: data []byte
// @return: error
func (o *Optional[T]) UnmarshalJSON(data []byte) error {
	o.Presented = true
	return json.Unmarshal(data, &o.Value)
}

type FiberCtx struct {
	Fctx fiber.Ctx
}

// @author: LoanTT
// @function: ValidateJson
// @description: Validate json
// @param: ctx fiber.Ctx
// @return: error
func (ctx *FiberCtx) ValidateJson() error {
	if !json.Valid(ctx.Fctx.BodyRaw()) {
		return msg.ErrRequestJsonNotValid
	}
	return nil
}

// @author: LoanTT
// @function: ParseJsonToStruct
// @description: Parse json to struct
// @param: ctx fiber.Ctx
// @param: dest interface{}
// @param: validate *validator.Validate
// @return: error
func (ctx *FiberCtx) ParseJsonToStruct(dest interface{}, validate *validator.Validate) error {
	if err := ctx.Fctx.Bind().Body(dest); err != nil {
		return err
	}
	if err := validate.Struct(dest); err != nil {
		return err
	}
	return nil
}

// @author: LoanTT
// @function: ParseUUID
// @description: Parse UUID
// @param: ctx fiber.Ctx
// @param: key string
// @return: string, error
func (ctx *FiberCtx) ParseUUID(key string) (string, error) {
	uuidVal := ctx.Fctx.Params(key)
	value, err := uuid.Parse(uuidVal)
	if err != nil {
		return "", err
	}
	return value.String(), nil
}

// @author: LoanTT
// @function: GetQueryString
// @description: Get query string
// @return: map[string]string, error
func (ctx *FiberCtx) ParseQuery(keys ...string) (map[string]string, error) {
	rawQueries := ctx.Fctx.Queries()
	if len(keys) == 0 {
		return rawQueries, nil
	}

	queries := make(map[string]string)
	for id := range keys {
		val, ok := rawQueries[keys[id]]
		if !ok {
			return nil, ErrKeyNotFound
		}
		queries[keys[id]] = val
	}
	return queries, nil
}

// @author: LoanTT
// @function: JsonResponse
// @description: Json response
// @param: ctx fiber.Ctx
// @param: respCode int
// @param: data ...interface{}
// @return: error
func (ctx *FiberCtx) JsonResponse(respCode int, code string, data ...interface{}) error {
	var resData interface{}
	if len(data) > 0 {
		resData = data[0]
	}
	return ctx.Fctx.
		Status(respCode).
		JSON(JSONResult{Status: "success", Data: resData, Code: code})
}

// @author: LoanTT
// @function: ErrResponse
// @description: Error response
// @param: err *fiber.Error
// @param: data ...interface{}
// @return: error
func (ctx *FiberCtx) ErrResponse(err *fiber.Error, data ...interface{}) error {
	var resData interface{}
	if len(data) > 0 {
		resData = data[0]
	}
	return ctx.Fctx.
		Status(err.Code).
		JSON(JSONResult{Status: "error", Data: resData, Code: err.Message})
}
