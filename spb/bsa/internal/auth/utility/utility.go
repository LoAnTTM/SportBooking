package utility

import (
	"spb/bsa/internal/auth/model"
	"spb/bsa/pkg/config"
	"spb/bsa/pkg/entities"

	"gorm.io/gorm"
)

// @author: LoanTT
// @function: MappingLoginResponse
// @description: mapping user to user response
// @param: user *entities.User
// @param: tokens map[string]string
// @return: *model.LoginResponse
func MappingLoginResponse(user *entities.User, tokens map[string]string) model.LoginResponse {
	return model.LoginResponse{
		AccessToken: tokens[config.ACCESS_TOKEN_NAME],
		User: model.UserResponse{
			UserID:   user.ID,
			FullName: user.FullName,
			Email:    user.Email,
			Phone:    user.Phone,
		},
	}
}

// @author: LoanTT
// @function: MappingRefreshResponse
// @description: Mapping refresh token response
// @return: model.RefreshTokenResponse
// @param: tokens map[string]string
func MappingRefreshResponse(tokens map[string]string) model.RefreshTokenResponse {
	return model.RefreshTokenResponse{
		AccessToken: tokens[config.ACCESS_TOKEN_NAME],
	}
}

// @author: LoanTT
// @function: Check email is verify
// @description: Return db
// @return: *gorm.DB
func EmailIsVerity(db *gorm.DB) *gorm.DB {
	return db.Where("is_email_verified = ?", true)
}

// @author: LoanTT
// @function: Check email is not verify
// @description: Return db
// @return: *gorm.DB
func EmailIsNotVerity(db *gorm.DB) *gorm.DB {
	return db.Where("is_email_verified = ?", false)
}
