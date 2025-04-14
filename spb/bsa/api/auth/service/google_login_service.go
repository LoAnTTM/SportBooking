package service

import (
	"context"

	"spb/bsa/api/auth/model"
	"spb/bsa/api/auth/utility"
	permissionModule "spb/bsa/api/permission"
	"spb/bsa/pkg/auth"
	tb "spb/bsa/pkg/entities"
	"spb/bsa/pkg/entities/enum"
	"spb/bsa/pkg/logger"
	"spb/bsa/pkg/msg"
	"spb/bsa/pkg/utils"

	"gorm.io/gorm"
)

func (s *Service) GoogleLogin(reqBody model.GoogleCallbackRequest) (*tb.User, error) {
	var err error
	var user tb.User

	c := context.Background()
	rawPayload, err := auth.VerifyToken(c, reqBody.Code)
	if err != nil {
		logger.Errorf(msg.ErrVerifyFailed("Google token", err))
		return nil, err
	}

	payload := utility.MapRawGooglePayload(rawPayload)
	err = s.db.
		Preload("AuthenticationProviders", "provider = ? AND provider_key = ?", enum.GOOGLE, payload.Sub).
		Preload("Role").
		Where("email = ?", payload.Email).
		First(&user).Error
	if err == nil {
		hasUpdate := false
		// add google provider if not found
		if len(user.AuthenticationProviders) == 0 || !checkProviderExist(user.AuthenticationProviders, enum.GOOGLE) {
			user.AuthenticationProviders = append(user.AuthenticationProviders, tb.AuthenticationProvider{
				Provider:    enum.GOOGLE,
				ProviderKey: payload.Sub,
			})
			hasUpdate = true
		}

		// remove password if user verifying email
		if !user.IsEmailVerified {
			user.Password = ""
			hasUpdate = true
		}

		if hasUpdate {
			err = s.db.Save(&user).Error
			if err != nil {
				logger.Errorf(msg.ErrUpdateFailed("user.provider or user.password", err))
				return nil, err
			}
		}

		// if user has google provider, return user
		var permissions []tb.Permission
		permissions, err = permissionModule.PermissionService.GetByRole(user.Role.ID)
		if err != nil {
			return nil, err
		}

		user.Role.Permissions = permissions
		return &user, nil
	}

	switch err {
	// create user if not found
	case gorm.ErrRecordNotFound:
		var role tb.Role
		err = s.db.Where("name = ?", tb.ROLE_USER).Preload("Permissions").First(&role).Error
		if err != nil {
			return nil, err
		}

		user = tb.User{
			Email:           payload.Email,
			FullName:        utils.ToPtr(payload.Name),
			Password:        "",
			Role:            role,
			IsEmailVerified: false,
			AuthenticationProviders: []tb.AuthenticationProvider{
				{
					Provider:    enum.GOOGLE,
					ProviderKey: payload.Sub,
				},
			},
		}
		err = s.db.Create(&user).Error
		if err != nil {
			logger.Errorf(msg.ErrCreateFailed("user", err))
			return nil, err
		}

		var permissions []tb.Permission
		permissions, err = permissionModule.PermissionService.GetByRole(user.Role.ID)
		if err != nil {
			return nil, err
		}

		user.Role.Permissions = permissions
	default:
		logger.Errorf(msg.ErrGetFailed("user", err))
		return nil, err
	}

	return &user, nil
}

func checkProviderExist(AuthenticationProviders []tb.AuthenticationProvider, provider enum.OAuthProvider) bool {
	for _, authProvider := range AuthenticationProviders {
		if authProvider.Provider == provider {
			return true
		}
	}
	return false
}
