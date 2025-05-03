package model

import (
	roleModel "spb/bsa/api/role/model"
)

var ORDER_BY = []string{
	"email",
	"full_name",
	"created_at",
	"updated_at",
}

type GetUsersRequest struct {
	Pagination UserPagination
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
	Users      []*UserResponse `json:"users"`
	Total      uint            `json:"total"`
	Pagination *UserPagination `json:"pagination"`
}

type CreateUserRequest struct {
	Email    string `json:"email"    validate:"min=6,max=256,required,email"`
	Password string `json:"password" validate:"min=6,max=256,required,password"`
	Role     string `json:"role_id" validate:"required,uuid"`
	FullName string `json:"full_name" validate:"min=2,max=255"`
	Phone    string `json:"phone" validate:"e164"`
}

type UpdateUserRequest struct {
	Phone    *string `json:"phone,omitempty" validate:"omitempty,e164"`
	FullName *string `json:"full_name,omitempty" validate:"omitempty,min=2,max=255"`
	Role     *string `json:"role,omitempty" validate:"omitempty,uuid"`
}
