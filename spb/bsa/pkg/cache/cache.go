package cache

import (
	"time"

	"spb/bsa/pkg/config"
	"spb/bsa/pkg/global"
)

// @author: LoanTT
// @function: SetVerifyEmailToken
// @description: set verify email token to cache
// @param: email string
// @param: value string
// @return: error
func SetVerifyEmailToken(email, value string) error {
	expires := time.Hour * 24 * 30
	err := global.SPB_REDIS.Set(config.VERIFY_USER_NT+":"+email, []byte(value), expires)
	return err
}

// @author: LoanTT
// @function: GetVerifyEmailToken
// @description: get verify email token from cache
// @param: email string
// @return: string, error
func GetVerifyEmailToken(email string) (string, error) {
	value, err := global.SPB_REDIS.Get(config.VERIFY_USER_NT + ":" + email)
	if err != nil {
		return "", err
	}
	return string(value), nil
}
