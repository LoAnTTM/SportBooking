package cache

import "github.com/gofiber/storage/redis/v3"

var (
	Jwt IJwtCache
	OTP IOTPCache
)

func NewCache(redisClient *redis.Storage) {
	Jwt = &JwtCache{client: redisClient}
	OTP = &OTPCache{client: redisClient}
}
