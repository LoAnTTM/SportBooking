package database

import "fmt"

var (
	ErrConnectionFailed = NewErrorArgs("failed to connect database: %+v")
	ErrMigrationFailed  = NewErrorArgs("failed to migrate database: %+v")
	ErrJoinTableFailed  = NewErrorArgs("failed to join table: %+v")
)

// @author: LoanTT
// @function: NewErrorArgs
// @description: Create new error
// @param: msg string
// @return: func(...interface{}) error
func NewErrorArgs(msg string) func(...interface{}) error {
	return func(args ...interface{}) error {
		return fmt.Errorf(msg, args)
	}
}
