package enum

import "database/sql/driver"

type OAuthProvider string

const (
	GOOGLE   OAuthProvider = "google"
	FACEBOOK OAuthProvider = "facebook"
)

func (st *OAuthProvider) Scan(val any) error {
	*st = OAuthProvider(val.(string))
	return nil
}

func (st OAuthProvider) Value() (driver.Value, error) {
	return string(st), nil
}
