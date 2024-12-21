package model

type RoleResponse struct {
	RoleID      string `json:"role_id"`
	RoleName    string `json:"role_name"`
	Permissions uint64 `json:"permissions"`
}
