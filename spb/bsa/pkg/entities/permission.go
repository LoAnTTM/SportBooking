package entities

import (
	"time"

	"gorm.io/gorm"
)

const PermissionTN = "permission"

type Permission struct {
	ID        uint64         `gorm:"primary_key" json:"id"`
	CreatedAt time.Time      `json:"created_at"`
	UpdatedAt time.Time      `json:"updated_at"`
	DeletedAt gorm.DeletedAt `json:"deleted_at"`
	Name      string         `gorm:"size:25;not null;unique" json:"name"`
}

func (Permission) TableName() string {
	return PermissionTN
}
