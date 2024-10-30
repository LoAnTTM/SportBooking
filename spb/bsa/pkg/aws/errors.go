package aws

import "fmt"

var ErrInternalServer = "InternalServerError"

func AWSError(errType string, err error) error {
	return fmt.Errorf("%s: %s", errType, err.Error())
}
