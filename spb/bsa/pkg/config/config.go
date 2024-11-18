package config

import (
	"errors"
	"fmt"
	"os"

	"spb/bsa/pkg/utils"

	"github.com/spf13/viper"
)

type Postgres struct {
	Host     string `mapstructure:"host"`
	Port     string `mapstructure:"port"`
	User     string `mapstructure:"user"`
	Password string `mapstructure:"password"`
	Dbname   string `mapstructure:"dbname"`
	SSLMode  string `mapstructure:"ssl_mode"`
}

type DB struct {
	Driver   string    `mapstructure:"engine"`
	Postgres *Postgres `mapstructure:"postgres"`
}

type Redis struct {
	Addrs    []string `mapstructure:"addrs"`
	Username string   `mapstructure:"username"`
	Password string   `mapstructure:"password"`
	PoolSize int      `mapstructure:"pool_size"`
	DB       int      `mapstructure:"db"`
}

type Logging struct {
	Level    int      `mapstructure:"level"`
	Output   []string `mapstructure:"output"`
	Filename string   `mapstructure:"filename"`
}

type Server struct {
	Env              string `mapstructure:"env"`
	Host             string `mapstructure:"host"`
	Port             string `mapstructure:"port"`
	ClientAddr       string `mapstructure:"client_addr"`
	VerifyEmailUri   string `mapstructure:"verify_email_uri"`
	ResetPasswordUri string `mapstructure:"reset_password_uri"`
}

type CORS struct {
	AllowOrigin      []string `mapstructure:"allow_origin"`
	AllowMethods     []string `mapstructure:"allow_methods"`
	AllowHeaders     []string `mapstructure:"allow_headers"`
	AllowCredentials bool     `mapstructure:"allow_credentials"`
}

type Cache struct {
	VerifyEmailExp   int `mapstructure:"verify_email_exp"`
	ResetPasswordExp int `mapstructure:"reset_password_exp"`
}

type JWT struct {
	Secret          string `yamll:"secret" mapstructure:"secret"`
	AccessTokenExp  int    `yamll:"access_token_exp" mapstructure:"access_token_exp"`
	RefreshTokenExp int    `yamll:"refresh_token_exp" mapstructure:"refresh_token_exp"`
	ExpireCache     int    `yamll:"expire_cache" mapstructure:"expire_cache"`
}

type OAuth struct {
	GoogleClientId     string `mapstructure:"google_client_id"`
	GoogleClientSecret string `mapstructure:"google_client_secret"`
}

type RedisQueue struct {
	ChannelName string `mapstructure:"channel_name"`
	ChannelSize int    `mapstructure:"channel_size"`
	WorkerNum   int    `mapstructure:"worker_num"`
}

type Ios struct {
	Enabled bool `mapstructure:"enabled"`
}

type Android struct {
	Enabled bool `mapstructure:"enabled"`
}

type Notification struct {
	Ios        Ios        `mapstructure:"ios"`
	Android    Android    `mapstructure:"android"`
	RedisQueue RedisQueue `mapstructure:"redis_queue"`
}

type AWS struct {
	Region     string `mapstructure:"region"`
	MaxRetries int    `mapstructure:"max_retries"`
}

type Config struct {
	ProjectName  string        `mapstructure:"project_name"`
	Server       *Server       `mapstructure:"server"`
	Cache        *Cache        `mapstructure:"cache"`
	JWT          *JWT          `mapstructure:"jwt"`
	DB           *DB           `mapstructure:"database"`
	Redis        *Redis        `mapstructure:"redis"`
	CORS         *CORS         `mapstructure:"cors"`
	Logging      *Logging      `mapstructure:"logging"`
	Notification *Notification `mapstructure:"notification"`
	AWS          *AWS          `mapstructure:"aws"`
	Vpr          *viper.Viper
}

// @author: LoanTT
// @function: LoadEnvVariables
// @description: Load env variables from configs/{localhost/docker}.yaml
// @param: c *Config
// @return: error
func (c *Config) LoadEnvVariables() error {
	c.Vpr.SetConfigType("yaml")

	// Check if we are running in docker
	if _, err := os.Stat("/.dockerenv"); err == nil {
		c.Vpr.SetConfigName("docker")
	} else if errors.Is(err, os.ErrNotExist) {
		c.Vpr.SetConfigName("localhost")
	} else {
		return fmt.Errorf("env check for config err: %+v", err)
	}

	basepath := utils.RootDir(1)
	configsDir := fmt.Sprintf("%s/configs", basepath)

	for _, envPath := range []string{configsDir} {
		c.Vpr.AddConfigPath(envPath)
	}

	if err := c.Vpr.ReadInConfig(); err != nil {
		return fmt.Errorf("fail to read config file, err: %+v", err)
	}

	if err := c.Vpr.Unmarshal(c); err != nil {
		return fmt.Errorf("failed loading conf, err: %+v", err.Error())
	}

	return nil
}

// @author: LoanTT
// @function: GetServerUrl
// @description: Get server url
// @param: c *Config
// @return: string server url
func (c *Config) GetServerUrl() string {
	url := fmt.Sprintf("http://%s", c.Server.Host)
	if c.Server.Port != "" {
		url = fmt.Sprintf("%s:%s", url, c.Server.Port)
	}

	return url
}
