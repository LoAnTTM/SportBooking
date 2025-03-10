package auth

import (
	"context"

	"spb/bsa/pkg/global"

	"google.golang.org/api/idtoken"
)

func VerifyToken(ctx context.Context, code string) (*idtoken.Payload, error) {
	tokenValidator, err := idtoken.NewValidator(ctx)
	if err != nil {
		return nil, err
	}

	payload, err := tokenValidator.Validate(ctx, code, global.SPB_CONFIG.OAuth.Google.ClientID)
	if err != nil {
		return nil, err
	}
	return payload, nil
}
