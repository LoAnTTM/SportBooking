package ses

import (
	aws_local "spb/bsa/pkg/aws"
	"spb/bsa/pkg/logger"
	"spb/bsa/pkg/utils"

	"github.com/aws/aws-sdk-go/aws"
	"github.com/aws/aws-sdk-go/aws/awserr"
	"github.com/aws/aws-sdk-go/aws/session"
	"github.com/aws/aws-sdk-go/service/ses"
)

type SESService interface {
	SendEmail(email *EmailInfo) (*ses.SendEmailOutput, error)
	ListEmails() ([]string, error)
	SendVerification(email string) (*ses.VerifyEmailAddressOutput, error)
	DeleteVerifiedEmail(email string) error
}

type sesService struct {
	sesInstance *ses.SES
}

// @author: LoanTT
// @function: NewSESService
// @description: Create a new ses service
// @param: sess *session.Session
// @return: SESService
func NewSESService(sess *session.Session) SESService {
	return &sesService{
		sesInstance: ses.New(sess),
	}
}

// @author: LoanTT
// @function: SendEmail
// @description: Send email
// @param: email *email.EmailInfo
// @return: *ses.SendEmailOutput, error
func (s *sesService) SendEmail(email *EmailInfo) (*ses.SendEmailOutput, error) {
	input := &ses.SendEmailInput{
		Destination: &ses.Destination{
			BccAddresses: utils.ToSlicePtr(email.Bcc),
			CcAddresses:  utils.ToSlicePtr(email.Cc),
			ToAddresses:  utils.ToSlicePtr(email.To),
		},
		Message: &ses.Message{
			Body: &ses.Body{
				Html: &ses.Content{
					Charset: aws.String(email.Charset),
					Data:    aws.String(email.Message),
				},
			},
			Subject: &ses.Content{
				Charset: aws.String(email.Charset),
				Data:    aws.String(email.Title),
			},
		},
		Source: aws.String(email.From),
	}

	logger.Debugf("sending email ..................................")

	// Attempt to send the email.
	result, err := s.sesInstance.SendEmail(input)
	// Display error messages if they occur.
	if err != nil {
		if aerr, ok := err.(awserr.Error); ok {
			switch aerr.Code() {
			case ses.ErrCodeMessageRejected:
				return nil, aws_local.AWSError(ses.ErrCodeMessageRejected, aerr)
			case ses.ErrCodeMailFromDomainNotVerifiedException:
				return nil, aws_local.AWSError(ses.ErrCodeMailFromDomainNotVerifiedException, aerr)
			case ses.ErrCodeConfigurationSetDoesNotExistException:
				return nil, aws_local.AWSError(ses.ErrCodeConfigurationSetDoesNotExistException, aerr)
			default:
				return nil, aws_local.AWSError(aws_local.ErrInternalServer, aerr)
			}
		} else {
			return nil, aws_local.AWSError(aws_local.ErrInternalServer, aerr)
		}
	}

	return result, nil
}

// @author: LoanTT
// @function: ListEmails
// @description: List emails
// @return: []string, error
func (s *sesService) ListEmails() ([]string, error) {
	result, err := s.sesInstance.ListIdentities((&ses.ListIdentitiesInput{
		IdentityType: aws.String("EmailAddress"),
	}))
	if err != nil {
		return nil, err
	}

	emails := []string{}
	for _, email := range result.Identities {
		e := []*string{email}
		verified, err := s.sesInstance.GetIdentityVerificationAttributes(&ses.GetIdentityVerificationAttributesInput{
			Identities: e,
		})
		if err != nil {
			return nil, err
		}

		for _, va := range verified.VerificationAttributes {
			if *va.VerificationStatus == "Success" {
				emails = append(emails, *email)
			}
		}
	}
	return emails, nil
}

// @author: LoanTT
// @function: SendVerification
// @description: Send verification
// @param: email string
// @return: *ses.VerifyEmailAddressOutput, error
func (s *sesService) SendVerification(email string) (*ses.VerifyEmailAddressOutput, error) {
	result, err := s.sesInstance.VerifyEmailAddress(
		&ses.VerifyEmailAddressInput{EmailAddress: aws.String(email)})
	if err != nil {
		if aerr, ok := err.(awserr.Error); ok {
			switch aerr.Code() {
			case ses.ErrCodeMessageRejected:
				return nil, aws_local.AWSError(ses.ErrCodeMessageRejected, aerr)
			case ses.ErrCodeMailFromDomainNotVerifiedException:
				return nil, aws_local.AWSError(ses.ErrCodeMailFromDomainNotVerifiedException, aerr)
			case ses.ErrCodeConfigurationSetDoesNotExistException:
				return nil, aws_local.AWSError(ses.ErrCodeConfigurationSetDoesNotExistException, aerr)
			default:
				return nil, aws_local.AWSError(aws_local.ErrInternalServer, aerr)
			}
		} else {
			return nil, aws_local.AWSError(aws_local.ErrInternalServer, aerr)
		}
	}

	return result, nil
}

// @author: LoanTT
// @function: DeleteVerifiedEmail
// @description: Delete verified email
// @param: email string
// @return: error
func (s *sesService) DeleteVerifiedEmail(email string) error {
	// Remove email address
	_, delErr := s.sesInstance.DeleteVerifiedEmailAddress(
		&ses.DeleteVerifiedEmailAddressInput{EmailAddress: aws.String(email)})

	if delErr != nil {
		return aws_local.AWSError(ses.ErrCodeCannotDeleteException, delErr)
	}
	return nil
}
