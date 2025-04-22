package utils

import (
	"encoding/json"
	"testing"

	"github.com/gofiber/fiber/v3"
	"github.com/stretchr/testify/assert"
	"github.com/valyala/fasthttp"
)

func TestFlexInt_UnmarshalJSON(t *testing.T) {
	t.Parallel()

	tests := []struct {
		name    string
		input   string
		want    FlexInt
		wantErr bool
	}{
		{
			name:    "numeric input",
			input:   `123`,
			want:    FlexInt(123),
			wantErr: false,
		},
		{
			name:    "string input",
			input:   `"456"`,
			want:    FlexInt(456),
			wantErr: false,
		},
		{
			name:    "invalid string",
			input:   `"abc"`,
			want:    FlexInt(0),
			wantErr: true,
		},
	}

	for _, tt := range tests {
		tt := tt
		t.Run(tt.name, func(t *testing.T) {
			t.Parallel()
			var got FlexInt
			err := json.Unmarshal([]byte(tt.input), &got)
			if tt.wantErr {
				assert.Error(t, err)
				return
			}
			assert.NoError(t, err)
			assert.Equal(t, tt.want, got)
		})
	}
}

func TestOptional_UnmarshalJSON(t *testing.T) {
	t.Parallel()

	type testStruct struct {
		Value string
	}

	tests := []struct {
		name    string
		input   string
		want    Optional[testStruct]
		wantErr bool
	}{
		{
			name:  "valid input",
			input: `{"Value":"test"}`,
			want: Optional[testStruct]{
				Presented: true,
				Value:     &testStruct{Value: "test"},
			},
			wantErr: false,
		},
		{
			name:  "null input",
			input: "null",
			want: Optional[testStruct]{
				Presented: true,
				Value:     nil,
			},
			wantErr: false,
		},
	}

	for _, tt := range tests {
		tt := tt
		t.Run(tt.name, func(t *testing.T) {
			t.Parallel()
			var got Optional[testStruct]
			err := json.Unmarshal([]byte(tt.input), &got)
			if tt.wantErr {
				assert.Error(t, err)
				return
			}
			assert.NoError(t, err)
			assert.Equal(t, tt.want.Presented, got.Presented)
			assert.Equal(t, tt.want.Value, got.Value)
		})
	}
}

func TestFiberCtx_ValidateJson(t *testing.T) {
	t.Parallel()

	tests := []struct {
		name    string
		body    []byte
		wantErr bool
	}{
		{
			name:    "valid json",
			body:    []byte(`{"test":"value"}`),
			wantErr: false,
		},
		{
			name:    "invalid json",
			body:    []byte(`{"test":value`),
			wantErr: true,
		},
	}

	for _, tt := range tests {
		tt := tt
		t.Run(tt.name, func(t *testing.T) {
			t.Parallel()
			app := fiber.New()
			ctx := app.AcquireCtx(&fasthttp.RequestCtx{})
			ctx.Request().SetBody(tt.body)

			fctx := &FiberCtx{Fctx: ctx}
			err := fctx.ValidateJson()
			if tt.wantErr {
				assert.Error(t, err)
				return
			}
			assert.NoError(t, err)
		})
	}
}

func TestFiberCtx_ParseUUID(t *testing.T) {
	t.Parallel()

	validUUID := "550e8400-e29b-41d4-a716-446655440000"

	tests := []struct {
		name    string
		param   string
		want    string
		wantErr bool
	}{
		{
			name:    "valid uuid",
			param:   validUUID,
			want:    validUUID,
			wantErr: false,
		},
		{
			name:    "invalid uuid",
			param:   "invalid-uuid",
			want:    "",
			wantErr: true,
		},
	}

	for _, tt := range tests {
		tt := tt
		t.Run(tt.name, func(t *testing.T) {
			t.Parallel()
			app := fiber.New()

			// Create a new request context
			fastCtx := &fasthttp.RequestCtx{}
			ctx := app.AcquireCtx(fastCtx)
			defer app.ReleaseCtx(ctx)

			// Set up a test route with parameter
			app.Get("/:id", func(c fiber.Ctx) error {
				return nil
			})

			// Set the route parameters
			ctx.Request().SetRequestURI("/" + tt.param)
			ctx.Method(fiber.MethodGet)

			// Handle the request to set up params
			app.Handler()(ctx.Context())

			fctx := &FiberCtx{Fctx: ctx}
			got, err := fctx.ParseUUID("id")
			if tt.wantErr {
				assert.Error(t, err)
				return
			}
			assert.NoError(t, err)
			assert.Equal(t, tt.want, got)
		})
	}
}

func TestFiberCtx_ParseQuery(t *testing.T) {
	t.Parallel()

	tests := []struct {
		name    string
		query   map[string]string
		keys    []string
		want    map[string]string
		wantErr bool
	}{
		{
			name: "all queries",
			query: map[string]string{
				"key1": "value1",
				"key2": "value2",
			},
			keys: []string{},
			want: map[string]string{
				"key1": "value1",
				"key2": "value2",
			},
			wantErr: false,
		},
		{
			name: "specific keys",
			query: map[string]string{
				"key1": "value1",
				"key2": "value2",
			},
			keys: []string{"key1"},
			want: map[string]string{
				"key1": "value1",
			},
			wantErr: false,
		},
		{
			name: "missing key",
			query: map[string]string{
				"key1": "value1",
			},
			keys:    []string{"key2"},
			want:    nil,
			wantErr: true,
		},
	}

	for _, tt := range tests {
		tt := tt
		t.Run(tt.name, func(t *testing.T) {
			t.Parallel()
			app := fiber.New()
			ctx := app.AcquireCtx(&fasthttp.RequestCtx{})

			for k, v := range tt.query {
				ctx.Query(k, v)
			}

			fctx := &FiberCtx{Fctx: ctx}
			got, err := fctx.ParseQuery(tt.keys...)
			if tt.wantErr {
				assert.Error(t, err)
				return
			}
			assert.NoError(t, err)
			assert.Equal(t, tt.want, got)
		})
	}
}
