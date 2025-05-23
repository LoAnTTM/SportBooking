package enum

import "database/sql/driver"

type Platform string

const (
	ANDROID Platform = "android"
	IOS     Platform = "ios"
	INAPP   Platform = "inapp"
	EMAIL   Platform = "email"
)

func (st *Platform) Scan(val any) error {
	*st = Platform(val.(string))
	return nil
}

func (st Platform) Value() (driver.Value, error) {
	return string(st), nil
}
