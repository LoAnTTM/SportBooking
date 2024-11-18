package model

import (
	roleModel "spb/bsa/internal/role/model"
	"spb/bsa/pkg/utils"
)

type GetUsersRequest struct {
	Pagination utils.Pagination
	Role       string
}

type UserResponse struct {
	UserId          string                 `json:"user_id"`
	Email           string                 `json:"email"`
	Role            roleModel.RoleResponse `json:"role"`
	FullName        *string                `json:"full_name,omitempty"`
	Phone           *string                `json:"phone,omitempty"`
	IsEmailVerified bool                   `json:"is_email_verified"`
}

type PermissionResponse struct {
	PermissionId   string `json:"id"`
	PermissionName string `json:"name"`
}

type GetUsersResponse struct {
	Users      []UserResponse    `json:"users"`
	Total      uint              `json:"total"`
	Pagination *utils.Pagination `json:"pagination"`
}

type CreateUserRequest struct {
	Email    string `json:"email" validate:"min=6,max=256,required,email"`
	Password string `json:"password" validate:"min=6,max=256,required"`
	Role     string `json:"role" validate:"required,uuid"`
}

type UpdateUserRequest struct {
	Phone    *string `json:"phone,omitempty" validate:"omitempty,e164"`
	FullName *string `json:"full_name,omitempty" validate:"omitempty,min=2,max=255"`
	Role     *string `json:"role,omitempty" validate:"omitempty,uuid"`
}
