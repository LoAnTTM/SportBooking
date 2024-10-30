package server

import (
	"fmt"
	"strings"

	_ "spb/bsa/docs"
	"spb/bsa/internal/auth"
	"spb/bsa/internal/location"
	"spb/bsa/internal/metadata"
	"spb/bsa/internal/notification"
	"spb/bsa/internal/notification_type"
	"spb/bsa/internal/role"
	"spb/bsa/internal/sport_type"
	"spb/bsa/internal/unit"
	"spb/bsa/internal/unit_price"
	"spb/bsa/internal/unit_service"
	"spb/bsa/internal/user"
	"spb/bsa/pkg/aws"
	"spb/bsa/pkg/aws/ses"
	"spb/bsa/pkg/global"
	zaplog "spb/bsa/pkg/logger"
	"spb/bsa/pkg/middleware"
	notify "spb/bsa/pkg/notification"
	database "spb/bsa/pkg/postgres"
	"spb/bsa/pkg/redis"
	"spb/bsa/pkg/swagger"
	"spb/bsa/pkg/utils"

	"github.com/goccy/go-json"
	"github.com/gofiber/fiber/v3"
	"github.com/gofiber/fiber/v3/middleware/cors"
	"github.com/gofiber/fiber/v3/middleware/logger"
	"github.com/gofiber/fiber/v3/middleware/recover"
)

// @author: LoanTT
// @function: corsOptions
// @description: Configure cors
func corsOptions() cors.Config {
	corsOpts := global.SPB_CONFIG.CORS
	return cors.Config{
		AllowOrigins:     corsOpts.AllowOrigin,
		AllowHeaders:     corsOpts.AllowHeaders,
		AllowCredentials: corsOpts.AllowCredentials,
		AllowMethods:     corsOpts.AllowMethods,
	}
}

type Fiber struct {
	App *fiber.App
}

// @author: LoanTT
// @function: GetApp
// @description: Create a new fiber app
func (f *Fiber) GetApp() {
	var err error
	// load env variables
	err = global.SPB_CONFIG.LoadEnvVariables()
	if err != nil {
		panic(fmt.Sprintf("failed to load env variables: %v\n", err))
	}
	// initialize logger
	zaplog.NewZlog(global.SPB_CONFIG)
	// connect database
	global.SPB_DB, err = database.ConnectDB(global.SPB_CONFIG)
	if err != nil {
		panic(fmt.Sprintf("failed to connect database: %v\n", err))
	}
	// connect redis
	global.SPB_REDIS, err = redis.NewClient(global.SPB_CONFIG)
	if err != nil {
		panic(fmt.Sprintf("failed to connect redis: %v\n", err))
	}
	// initialize validator
	global.SPB_VALIDATOR, err = utils.NewValidator()
	if err != nil {
		panic(fmt.Sprintf("failed to create validator: %v\n", err))
	}
	// load aws session
	awsSession, err := aws.NewAWSSession(global.SPB_CONFIG)
	if err != nil {
		panic(fmt.Sprintf("failed to connect aws: %v\n", err))
	}
	// initialize notification
	global.SPB_NOTIFY = notify.NewNotification(
		global.SPB_CONFIG,
		global.SPB_REDIS,
		ses.NewSESService(awsSession))

	// create fiber app
	f.App = fiber.New(fiber.Config{
		CaseSensitive:                true,
		StrictRouting:                false,
		ServerHeader:                 global.SPB_CONFIG.ProjectName,
		BodyLimit:                    500 << 20, // 500 MB
		DisablePreParseMultipartForm: true,
		StreamRequestBody:            true,
		JSONEncoder:                  json.Marshal,
		JSONDecoder:                  json.Unmarshal,
	})
}

// @author: LoanTT
// @function: LoadMiddleware
// @description: Load middleware (cors, logger, recover)
func (f *Fiber) LoadMiddleware() {
	f.App.Use(logger.New())
	f.App.Use(recover.New())
	f.App.Use(cors.New(corsOptions()))
}

// @author: LoanTT
// @function: LoadSwagger
// @description: Load swagger
func (f *Fiber) LoadSwagger() {
	f.App.Get("/swagger/*", swagger.HandlerDefault)
}

// @author: LoanTT
// @function: LoadRoutes
// @description: Load all routes
func (f *Fiber) LoadRoutes() {
	custMiddlewares := middleware.NewCustomMiddleware()
	skipJwtCheckRoutes := []string{
		"/api/v1/auth/login",
		"/api/v1/auth/register",
		"/api/v1/auth/refresh",
		"/api/v1/auth/verify-email",
		"/apt/v1/locations",
	}
	router := f.App.Group("",
		custMiddlewares.Log(),                           // add logging to all routes
		custMiddlewares.CheckJwt(skipJwtCheckRoutes...), // add jwt check to all routes
	)

	auth.LoadModule(router, custMiddlewares)
	role.LoadModule(router, custMiddlewares)
	user.LoadModule(router, custMiddlewares)
	unit_service.LoadModule(router, custMiddlewares)
	unit_price.LoadModule(router, custMiddlewares)
	unit.LoadModule(router, custMiddlewares)
	sport_type.LoadModule(router, custMiddlewares)
	location.LoadModule(router, custMiddlewares)
	metadata.LoadModule(router, custMiddlewares)
	notification_type.LoadModule(router, custMiddlewares)
	notification.LoadModule(router, custMiddlewares)

	// a custom 404 handler
	f.App.Use(func(ctx fiber.Ctx) error {
		return ctx.Status(fiber.StatusNotFound).JSON(fiber.Map{
			"message": "resource Not Found",
		})
	})
}

// @author: LoanTT
// @function: Start
// @description: Start server
func (f *Fiber) Start() {
	fmt.Println(strings.Repeat("*", 50))
	fmt.Printf("Server env: %+v\n", global.SPB_CONFIG.Server.Env)
	fmt.Println(strings.Repeat("*", 50))

	defer database.CloseDB(global.SPB_DB)
	defer redis.CloseRedisClient(global.SPB_REDIS)
	defer notify.Shutdown(global.SPB_NOTIFY)

	err := f.App.Listen(fmt.Sprintf(":%s", global.SPB_CONFIG.Server.Port))
	if err != nil {
		zaplog.Fatalf("failed to start server: %v", err)
	}
}

var Api = &Fiber{}
