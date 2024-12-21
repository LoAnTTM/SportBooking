package cache

import (
	"time"

	"github.com/gofiber/storage/redis/v3"
)

type IJwtCache interface {
	IsBlackListed(token string) bool
	SetToBlackList(token string, expires int) error
	GetJwt(key string) (string, error)
	SetJwt(key string, value string, expires int) error
}

type JwtCache struct {
	client *redis.Storage
}

// @author: LoanTT
// @function: IsBlackListed
// @description: check if token is in the blacklist
// @param: token string
// @return: bool
func (j *JwtCache) IsBlackListed(token string) bool {
	value, err := j.client.Get(token)
	return err != nil || len(value) > 0
}

// @author: LoanTT
// @function: SetToBlackList
// @description: set token to blacklist
// @param: token string
// @return: bool
func (j *JwtCache) SetToBlackList(token string, expires int) error {
	expireTime := time.Minute * time.Duration(expires)
	err := j.client.Set(token, []byte{0}, expireTime) // need set value != ""
	if err != nil {
		return err
	}
	return nil
}

// @author: LoanTT
// @function: GetJwt
// @description: get jwt from cache
// @param: key string
// @return: string
func (j *JwtCache) GetJwt(key string) (string, error) {
	jwt, err := j.client.Get(key)
	if err != nil {
		return "", err
	}
	return string(jwt), nil
}

// @author: LoanTT
// @function: SetJwt
// @description: set jwt to cache
// @param: key string
// @param: value string
// @param: expires int
// @return: error
func (j *JwtCache) SetJwt(key, value string, expires int) error {
	expireTime := time.Minute * time.Duration(expires)
	err := j.client.Set(key, []byte(value), expireTime)
	if err != nil {
		return err
	}

	return nil
}
