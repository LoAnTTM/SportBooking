package entities

import "time"

var OrderTN = "order"

type Order struct {
	Base
	TotalAmount    float32    `gorm:"type:decimal(12,2);" json:"total_amount"`
	StartTime      time.Time  `gorm:"not null" json:"start_time"`
	EndTime        time.Time  `gorm:"not null" json:"end_time"`
	Status         int8       `gorm:"not null" json:"status"`
	IsApproved     bool       `gorm:"not null;default:false" json:"is_approved"`
	ApproveOwnerID string     `gorm:"type:uuid" json:"approve_owner_id"`
	ApproveOwner   ClubMember `gorm:"foreignKey:ApproveOwnerID" json:"approve_owner"`
	IsPaid         bool       `gorm:"not null;default:false" json:"is_paid"`
	Tax            float32    `gorm:"type:decimal(5,2);not null;default:0.00" json:"tax"`
	Discount       float32    `gorm:"type:decimal(5,2);not null;default:0.00" json:"discount"`
	EvidentID      string     `gorm:"type:uuid" json:"evident_id"`
	Evident        Media      `gorm:"foreignKey:EvidentID" json:"evident"`
	UnitID         string     `gorm:"type:uuid;not null" json:"unit_id"`
	Unit           Unit       `gorm:"foreignKey:UnitID" json:"unit"`
}

func (Order) TableName() string {
	return OrderTN
}
