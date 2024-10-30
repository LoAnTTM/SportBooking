package entities

const PermissionTN = "permission"

type Permission struct {
	Base
	Name string `gorm:"size:25;not null;unique" json:"name"`
}

func (Permission) TableName() string {
	return PermissionTN
}
