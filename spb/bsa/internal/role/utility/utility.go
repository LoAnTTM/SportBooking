package utility

import (
	"spb/bsa/internal/role/model"
	tb "spb/bsa/pkg/entities"
)

// @author: LoanTT
// @function: MapRoleEntityToResponse
// @description: map role entity to role response
// @param: role *tb.Role
// @return: model.RoleResponse
func MapRoleEntityToResponse(role *tb.Role) model.RoleResponse {
	return model.RoleResponse{
		RoleID:      role.ID,
		RoleName:    role.Name,
		Permissions: role.PermissionBit,
	}
}

// @author: LoanTT
// @function: FlattenAndGetRoleIds
// @description: Flatten role tree and get role ids
// @param: []tb.Role
// @return: []string
func FlattenAndGetRoleIds(roles []tb.Role) []string {
	var children []string
	for id := range roles {
		children = append(children, roles[id].ID)
		children = append(children, FlattenAndGetRoleIds(roles[id].Children)...)
		roles[id].Children = nil
	}
	return children
}

// @author: LoanTT
// @function: FlattenAndGetRoleNames
// @description: Flatten role tree and get role ids
// @param: []tb.Role
// @return: []string
func FlattenAndGetRoleNames(roles []tb.Role) []string {
	var children []string
	for id := range roles {
		children = append(children, roles[id].Name)
		children = append(children, FlattenAndGetRoleNames(roles[id].Children)...)
		roles[id].Children = nil
	}
	return children
}
