package utils

import (
	"crypto/hmac"
	"crypto/sha256"
	"encoding/hex"

	"golang.org/x/crypto/bcrypt"
)

// @author: LoanTT
// @function: BcryptCheck
// @description: Bcrypt check
// @param: strVal string
// @param: hashVal string
// @return: bool
func BcryptCheck(strVal, hashVal string) bool {
	err := bcrypt.CompareHashAndPassword([]byte(hashVal), []byte(strVal))
	return err == nil
}

// @author: LoanTT
// @function: BcryptHash
// @description: Bcrypt hash
// @param: strVal string
// @param: cost ...int
// @return: string
func BcryptHash(strVal string, cost ...int) string {
	var bcryptCost int = bcrypt.DefaultCost
	if len(cost) > 0 {
		bcryptCost = cost[0]
	}
	bytes, _ := bcrypt.GenerateFromPassword([]byte(strVal), bcryptCost)
	return string(bytes)
}

func HmacSHA256(data, key string) string {
	h := hmac.New(sha256.New, []byte(key))
	h.Write([]byte(data))
	return hex.EncodeToString(h.Sum(nil))
}
