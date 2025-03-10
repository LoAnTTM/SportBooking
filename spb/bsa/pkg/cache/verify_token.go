package cache

import (
	"context"
	"time"

	"github.com/gofiber/storage/redis/v3"
)

type IOTPCache interface {
	SetOTP(token string, expires int) error
	CheckOTP(token string) bool
	SearchOTP(prefixKey string) (string, error)
	DelOTP(token string)
}

type OTPCache struct {
	client *redis.Storage
}

// @author: LoanTT
// @function: SetOTP
// @description: set verify email OTP to cache
// @param: token string
// @return: error
func (c *OTPCache) SetOTP(token string, expires int) error {
	expireTime := time.Minute * time.Duration(expires)
	err := c.client.Set(token, []byte{0}, expireTime)
	return err
}

// @author: LoanTT
// @function: CheckOTP
// @description: get verify email token from cache
// @param: email string
// @return: string, error
func (c *OTPCache) CheckOTP(token string) bool {
	_, err := c.client.Get(token)
	return err == nil
}

// @author: LoanTT
// @function: SearchOTP
// @description: search verify email token from cache
// @param: pattern string
// @return: string, error
func (c *OTPCache) SearchOTP(pattern string) (string, error) {
	keys, _, err := c.client.Conn().Scan(context.Background(), 0, pattern, 0).Result()
	if err != nil {
		return "", err
	}

	if len(keys) == 0 {
		return "", nil
	}

	return keys[0], nil
}

// @author: LoanTT
// @function: DelOTP
// @description: delete verify email token from cache
// @param: token string
func (c *OTPCache) DelOTP(token string) {
	_ = c.client.Delete(token)
}
