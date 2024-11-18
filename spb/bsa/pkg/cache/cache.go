package cache

import (
	"time"

	"spb/bsa/pkg/config"
	"spb/bsa/pkg/global"
)

// @author: LoanTT
// @function: SetVerifyToken
// @description: set verify email token to cache
// @param: token string
// @return: error
func SetVerifyToken(token string, expires int) error {
	expireVal := time.Minute * time.Duration(expires)
	err := global.SPB_REDIS.Set(config.VERIFY_TOKEN_CACHE+":"+token, []byte{0}, expireVal)
	return err
}

// @author: LoanTT
// @function: CheckVerifyEmailToken
// @description: get verify email token from cache
// @param: email string
// @return: string, error
func CheckVerifyToken(token string) bool {
	_, err := global.SPB_REDIS.Get(config.VERIFY_TOKEN_CACHE + ":" + token)
	return err == nil
}

// @author: LoanTT
// @function: DelVerifyToken
// @description: delete verify email token from cache
// @param: token string
func DelVerifyToken(token string) {
	_ = global.SPB_REDIS.Delete(config.VERIFY_TOKEN_CACHE + ":" + token)
}
