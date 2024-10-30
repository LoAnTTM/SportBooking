package cache

import (
	"time"

	"spb/bsa/pkg/config"
	"spb/bsa/pkg/global"
)

type IJwtCache interface {
	IsBlackListed(token string) bool
	GetJwt(key string) (string, error)
	SetJwt(key string, value string) error
}

type JwtCache struct{}

var JwtCacheApp = new(JwtCache)

// @author: LoanTT
// @function: IsBlackListed
// @description: check if token is in the blacklist
// @param: token string
// @return: bool
func (j *JwtCache) IsBlackListed(token string) bool {
	blacklistToken := config.BLACKLIST_PREFIX + token
	value, err := global.SPB_REDIS.Get(blacklistToken)

	return err != nil || len(value) > 0
}

// @author: LoanTT
// @function: SetToBlackList
// @description: set token to blacklist
// @param: token string
// @return: bool
func (j *JwtCache) SetToBlackList(token string, expireConf int) error {
	blacklistToken := config.BLACKLIST_PREFIX + token
	expires := time.Minute * time.Duration(expireConf)
	err := global.SPB_REDIS.Set(blacklistToken, []byte{0}, expires) // need set value != ""
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
	jwt, err := global.SPB_REDIS.Get(key)
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
// @return: error
func (j *JwtCache) SetJwt(key, value string) error {
	expires := time.Minute * time.Duration(global.SPB_CONFIG.JWT.ExpireCache)
	err := global.SPB_REDIS.Set(key, []byte(value), expires)
	if err != nil {
		return err
	}

	return nil
}
