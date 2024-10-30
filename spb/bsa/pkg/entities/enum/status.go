package enum

import "database/sql/driver"

type Status string

const (
	ACTIVE   Status = "active"
	INACTIVE Status = "inactive"
)

func (st *Status) Scan(val interface{}) error {
	*st = Status(val.([]byte))
	return nil
}

func (st Status) Value() (driver.Value, error) {
	return string(st), nil
}
