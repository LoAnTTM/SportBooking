package database

import (
	"fmt"
	"log"
	"os"
	"time"

	"spb/bsa/pkg/config"
	tb "spb/bsa/pkg/entities"
	"spb/bsa/pkg/msg"

	"gorm.io/driver/postgres"
	"gorm.io/gorm"
	"gorm.io/gorm/logger"
)

// @author: LoanTT
// @function: GetDbUrl
// @description: Get database url from config
// @param: c *Config
// @return: string
func GetDbUrl(configVal *config.Config) string {
	return fmt.Sprintf("host=%s port=%s user=%s dbname=%s password=%s sslmode=%s",
		configVal.DB.Postgres.Host,
		configVal.DB.Postgres.Port,
		configVal.DB.Postgres.User,
		configVal.DB.Postgres.Dbname,
		configVal.DB.Postgres.Password,
		configVal.DB.Postgres.SSLMode,
	)
}

// @author: LoanTT
// @function: ConnectDB
// @description: Connect to database
// @param: c *Config
// @return: *gorm.DB, error
func ConnectDB(configVal *config.Config) (*gorm.DB, error) {
	databaseURL := GetDbUrl(configVal)

	logLevel := logger.Silent
	switch configVal.Server.Debug {
	case true:
		logLevel = logger.Info
	case false:
		logLevel = logger.Error
	}

	db, err := gorm.Open(postgres.Open(databaseURL), &gorm.Config{
		SkipDefaultTransaction: true,
		Logger: logger.New(
			log.New(os.Stdout, "\r\n", log.LstdFlags),
			logger.Config{
				SlowThreshold:             time.Second,
				LogLevel:                  logLevel,
				IgnoreRecordNotFoundError: true,
				Colorful:                  true,
			},
		),
	})
	if err != nil {
		return nil, msg.ErrConnectionFailed(err)
	}

	err = AutoMigrate(db)
	if err != nil {
		return nil, err
	}
	return db, nil
}

// @author: LoanTT
// @function: AutoMigrate
// @description: Auto migrate models
// @param: db *gorm.DB
// @return: error
func AutoMigrate(db *gorm.DB) error {
	err := db.AutoMigrate(
		&tb.Metadata{},
		&tb.NotificationType{},
		&tb.Notification{},
		&tb.Ward{},
		&tb.District{},
		&tb.Province{},
		&tb.Club{},
		&tb.ClubMember{},
		&tb.Unit{},
		&tb.UnitPrice{},
		&tb.UnitService{},
		&tb.Permission{},
		&tb.Role{},
		&tb.Media{},
		&tb.User{},
		&tb.Address{},
		&tb.Order{},
		&tb.OrderItem{},
		&tb.SportType{},
		&tb.Transaction{},
		&tb.AuthenticationProvider{})
	if err != nil {
		return msg.ErrMigrationFailed(err)
	}

	return nil
}

// @author: LoanTT
// @function: CloseDB
// @description: Close database
// @param: db *gorm.DB
func CloseDB(db *gorm.DB) {
	dbInstance, _ := db.DB()
	_ = dbInstance.Close()
}
