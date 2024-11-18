package model

import (
	"github.com/golang-jwt/jwt/v5"
)

type UserClaims struct {
	UserID     string `json:"user_id"`
	Email      string `json:"email"`
	Role       string `json:"role"`
	Permission uint64 `json:"permission"`
	jwt.RegisteredClaims
}

type UserResponse struct {
	UserID   string  `json:"user_id"`
	Email    string  `json:"email"`
	FullName *string `json:"full_name,omitempty"`
	Phone    *string `json:"phone,omitempty"`
}

type LoginRequest struct {
	Email    string `json:"email"    validate:"min=6,max=256,required,email"`
	Password string `json:"password" validate:"min=6,max=256,required"`
}

type LoginResponse struct {
	AccessToken string       `json:"access_token"`
	User        UserResponse `json:"user"`
}

type RegisterRequest struct {
	Email    string `json:"email"    validate:"min=6,max=256,required,email"`
	Password string `json:"password" validate:"min=6,max=256,required"`
}

type RefreshTokenResponse struct {
	AccessToken string `json:"access_token"`
}

type VerifyEmailRequest struct {
	Token string `json:"token"  validate:"uuid,required"`
}

type ForgotPasswordRequest struct {
	Email string `json:"email" validate:"min=6,max=256,required,email"`
}

type VerifyTokenRequest struct {
	Token string `json:"token"  validate:"uuid,required"`
	Email string `json:"email"  validate:"min=6,max=256,required,email"`
}

type ResetPasswordRequest struct {
	Token    string `json:"token"    validate:"uuid,required"`
	Email    string `json:"email"    validate:"min=6,max=256,required,email"`
	Password string `json:"password" validate:"min=6,max=256,required"`
}
