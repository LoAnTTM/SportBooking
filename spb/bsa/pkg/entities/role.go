package entities

const RoleTN = "role"

type RoleDefault string

const (
	ROLE_ADMIN  RoleDefault = "admin"
	ROLE_USER   RoleDefault = "user"
	ROLE_CLIENT RoleDefault = "client"
)

type Role struct {
	Base
	Name        string       `gorm:"size:10;unique;not null" json:"name"`
	Description string       `gorm:"size:255" json:"description"`
	Permissions []Permission `gorm:"many2many:role_permissions;" json:"permissions"`
	ParentId    *string      `gorm:"type:uuid" json:"parentId"`
	Children    []Role       `gorm:"foreignKey:ParentId" json:"children"`
}

func (Role) TableName() string {
	return RoleTN
}
