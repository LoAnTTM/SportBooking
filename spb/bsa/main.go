package main

import (
	"os"

	"spb/bsa/cmd/server"
	"spb/bsa/pkg/config"
	"spb/bsa/pkg/global"
	"spb/bsa/pkg/logger"

	"github.com/spf13/viper"
	"github.com/urfave/cli/v2"
)

// @author: LoanTT
// @function: executeServer
// @description: execute Fiber server
func executeServer() {
	// load viper config
	global.SPB_CONFIG = &config.Config{
		Vpr: viper.GetViper(),
	}
	// initialize api server
	apiServer := server.Api
	// create api server
	apiServer.GetApp()
	// load middleware
	apiServer.LoadMiddleware()
	apiServer.LoadSwagger()
	apiServer.LoadRoutes()
	// start api server
	apiServer.Start()
}

// @title Sport Booking API
// @version 1.0
// @description This is a swagger for Sport Booking APIs
// @termsOfService http://swagger.io/terms/
// @contact.name LoanTT
// @contact.email loanTT@gmail.com
// @license.name Apache 2.0
// @license.url http://www.apache.org/licenses/LICENSE-2.0.html
// @host localhost:3000
// @BasePath /
func main() {
	app := &cli.App{
		Name:  "Sport booking",
		Usage: "Sport booking system",
		Commands: []*cli.Command{
			{
				Name:  "bsa",
				Usage: "sport booking server",
				Action: func(c *cli.Context) error {
					executeServer()
					return nil
				},
			},
		},
	}

	if err := app.Run(os.Args); err != nil {
		logger.Errorf(err)
	}
}
