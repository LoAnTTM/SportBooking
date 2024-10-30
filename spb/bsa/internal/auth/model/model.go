package model

import (
	"github.com/golang-jwt/jwt/v5"
)

type UserClaims struct {
	UserID      string         `json:"user_id"`
	Email       string         `json:"email"`
	Role        string         `json:"role"`
	Permissions map[string]int `json:"permissions"`
	jwt.RegisteredClaims
}

type UserResponse struct {
	UserID   string  `json:"user_id"`
	Email    string  `json:"email"`
	FullName *string `json:"full_name,omitempty"`
	Phone    *string `json:"phone,omitempty"`
}

type LoginRequest struct {
	Email    string `json:"email"    validate:"min=6,max=32,required,email"`
	Password string `json:"password" validate:"min=6,max=32,required"`
}

type LoginResponse struct {
	AccessToken string       `json:"access_token"`
	User        UserResponse `json:"user"`
}

type RegisterRequest struct {
	Email    string `json:"email"    validate:"min=6,max=32,required,email"`
	Password string `json:"password" validate:"min=6,max=32,required"`
}

type RefreshTokenResponse struct {
	AccessToken string `json:"access_token"`
}
