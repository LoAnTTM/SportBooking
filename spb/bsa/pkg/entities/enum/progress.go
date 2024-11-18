package enum

import "database/sql/driver"

type Progress string

const (
	INPROGRESS Progress = "inprogress"
	PENDING    Progress = "pending"
	SUCCESS    Progress = "success"
	FAILURE    Progress = "failure"
)

func (st *Progress) Scan(val interface{}) error {
	*st = Progress(val.(string))
	return nil
}

func (st Progress) Value() (driver.Value, error) {
	return string(st), nil
}
