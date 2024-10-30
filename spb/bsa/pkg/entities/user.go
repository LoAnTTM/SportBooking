package entities

const UserTN = "user"

type User struct {
	Base
	Email            string  `gorm:"size:255;not null" json:"email"`
	Password         string  `gorm:"size:255;not null" json:"password"`
	FullName         *string `gorm:"size:255" json:"full_name"`
	Phone            *string `gorm:"size:25" json:"phone"`
	IsEmailVerified  bool    `gorm:"not null" json:"is_email_verified"`
	EmailVerifyToken *string `gorm:"size:255" json:"email_verify_token"`
	RoleID           string  `gorm:"type:uuid;not null" json:"role_id"`
	Role             Role    `gorm:"foreignKey:RoleID" json:"role"`
}

func (User) TableName() string {
	return UserTN
}
