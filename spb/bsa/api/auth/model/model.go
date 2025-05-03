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
	Role     string  `json:"role"`
}

type LoginRequest struct {
	Email    string `json:"email"    validate:"min=6,max=256,required,email"`
	Password string `json:"password" validate:"min=6,max=256,required,password"`
}

type LoginResponse struct {
	AccessToken string       `json:"access_token"`
	User        UserResponse `json:"user"`
}

type RegisterRequest struct {
	Email    string `json:"email"    validate:"min=6,max=256,required,email"`
	Password string `json:"password" validate:"min=6,max=256,required,password"`
}

type RefreshTokenResponse struct {
	AccessToken string `json:"access_token"`
}

type VerifyRegisterTokenRequest struct {
	Token int    `json:"token"  validate:"gte=999,lte=1000000"`
	Email string `json:"email"  validate:"min=6,max=256,required,email"`
}

type ForgotPasswordRequest struct {
	Email string `json:"email" validate:"min=6,max=256,required,email"`
}

type VerifyForgotPasswordTokenRequest struct {
	Token int    `json:"token"  validate:"gte=999,lte=1000000"`
	Email string `json:"email"  validate:"min=6,max=256,required,email"`
}

type ResetPasswordRequest struct {
	Token    int    `json:"token"    validate:"gte=999,lte=1000000"`
	Email    string `json:"email"    validate:"min=6,max=256,required,email"`
	Password string `json:"password" validate:"min=6,max=256,required,password"`
}

type SendVerificationRequest struct {
	Email string `json:"email" validate:"required,email"`
}

type GoogleCallbackRequest struct {
	Code string `json:"code" validate:"required"`
}

type GooglePayload struct {
	Email string `json:"email"`
	Name  string `json:"name"`
	Sub   string `json:"sub"`
}

type ResendVerifyRegisterTokenRequest struct {
	Email string `json:"email" validate:"min=6,max=256,required,email"`
}

type ChangePasswordRequest struct {
	CurrentPassword string `json:"current_password" validate:"min=6,max=256,required,password"`
	NewPassword     string `json:"new_password"     validate:"min=6,max=256,required,password"`
}
