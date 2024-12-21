package cache

import "github.com/gofiber/storage/redis/v3"

var (
	Jwt         IJwtCache
	VerifyToken IVerifyTokenCache
)

func NewCache(redisClient *redis.Storage) {
	Jwt = &JwtCache{client: redisClient}
	VerifyToken = &VerifyTokenCache{client: redisClient}
}
