package model

type RoleResponse struct {
	RoleID      string               `json:"role_id"`
	RoleName    string               `json:"role_name"`
	Permissions []PermissionResponse `json:"permissions"`
}

type PermissionResponse struct {
	PermissionID   string `json:"permission_id"`
	PermissionName string `json:"permission_name"`
}
