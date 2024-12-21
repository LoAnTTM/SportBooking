package cache

import (
	"time"

	"github.com/gofiber/storage/redis/v3"
)

type IVerifyTokenCache interface {
	SetVerifyToken(token string, expires int) error
	CheckVerifyToken(token string) bool
	DelVerifyToken(token string)
}

type VerifyTokenCache struct {
	client *redis.Storage
}

// @author: LoanTT
// @function: SetVerifyToken
// @description: set verify email token to cache
// @param: token string
// @return: error
func (c *VerifyTokenCache) SetVerifyToken(token string, expires int) error {
	expireTime := time.Minute * time.Duration(expires)
	err := c.client.Set(token, []byte{0}, expireTime)
	return err
}

// @author: LoanTT
// @function: CheckVerifyEmailToken
// @description: get verify email token from cache
// @param: email string
// @return: string, error
func (c *VerifyTokenCache) CheckVerifyToken(token string) bool {
	_, err := c.client.Get(token)
	return err == nil
}

// @author: LoanTT
// @function: DelVerifyToken
// @description: delete verify email token from cache
// @param: token string
func (c *VerifyTokenCache) DelVerifyToken(token string) {
	_ = c.client.Delete(token)
}
