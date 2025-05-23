package enum

import "database/sql/driver"

type Status string

const (
	ACTIVE   Status = "active"
	INACTIVE Status = "inactive"
)

func (st *Status) Scan(val any) error {
	*st = Status(val.(string))
	return nil
}

func (st Status) Value() (driver.Value, error) {
	return string(st), nil
}
