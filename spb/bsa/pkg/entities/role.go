package entities

const RoleTN = "role"

type RoleDefault string

const (
	ROLE_ADMIN         RoleDefault = "admin"
	ROLE_USER          RoleDefault = "user"
	ROLE_CLIENT        RoleDefault = "client"
	ROLE_CLIENT_MEMBER RoleDefault = "client_member"
)

type Role struct {
	Base
	Name          string       `gorm:"size:20;unique;not null" json:"name"`
	Description   string       `gorm:"size:255" json:"description"`
	Permissions   []Permission `gorm:"many2many:role_permissions;" json:"permissions"`
	PermissionBit uint64       `json:"permission_bit"`
	ParentId      *string      `gorm:"type:uuid" json:"parentId"`
	Children      []Role       `gorm:"foreignKey:ParentId" json:"children"`
}

func (Role) TableName() string {
	return RoleTN
}
