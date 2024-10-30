package aws

import (
	"spb/bsa/pkg/config"

	"github.com/aws/aws-sdk-go/aws"
	"github.com/aws/aws-sdk-go/aws/session"
)

func NewAWSSession(configVal *config.Config) (*session.Session, error) {
	sess, err := session.NewSession(aws.NewConfig().
		WithRegion(configVal.AWS.Region).
		WithMaxRetries(configVal.AWS.MaxRetries))
	if err != nil {
		return nil, err
	}
	return sess, nil
}
