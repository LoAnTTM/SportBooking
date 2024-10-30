package redis

import (
	"fmt"
	"runtime"

	"spb/bsa/pkg/config"

	"github.com/gofiber/storage/redis/v3"
)

// @author: LoanTT
// @function: NewClient
// @description: Connect to redis
// @param: c *Config
// @return: *redis.Storage, error
func NewClient(configVal *config.Config) (*redis.Storage, error) {
	store := redis.New(redis.Config{
		Addrs:    configVal.Redis.Addrs,
		Username: configVal.Redis.Username,
		Password: configVal.Redis.Password,
		Database: configVal.Redis.DB,
		PoolSize: configVal.Redis.PoolSize * runtime.GOMAXPROCS(0),
	})
	_, err := store.Get("PING")
	if err != nil {
		fmt.Printf("redis connect error: %v\n", err)
		return nil, err
	}
	return store, nil
}

// @author: LoanTT
// @function: CloseRedisClient
// @description: Close redis
// @param: store *redis.Storage
func CloseRedisClient(store *redis.Storage) {
	_ = store.Close()
}
