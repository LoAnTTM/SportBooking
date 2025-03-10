package entities

import "spb/bsa/pkg/entities/enum"

var AuthenticationProviderTN = "authentication_provider"

type AuthenticationProvider struct {
	Base
	Provider    enum.OAuthProvider `gorm:"type:oauth_provider;uniqueIndex:idx_user_provider;not null" json:"provider"`
	UserID      string             `gorm:"uniqueIndex:idx_user_provider;not null" json:"user_id"`
	ProviderKey string             `gorm:"uniqueIndex:idx_user_provider;not null" json:"provider_key"`
	User        User               `gorm:"foreignKey:UserID;not null"`
}

func (AuthenticationProvider) TableName() string {
	return AuthenticationProviderTN
}
