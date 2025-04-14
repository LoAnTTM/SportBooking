package entities

import (
	"spb/bsa/pkg/entities/enum"
)

const OrderTN = "order"

// TODO: Add tax and discount
type Order struct {
	Base
	TotalAmount    int64         `gorm:"default:0" json:"total_amount"`
	AppTranID      string        `gorm:"size:255;uniqueIndex;not null" json:"app_tran_id"`
	Currency       string        `gorm:"size:3;not null" json:"currency"`
	Status         enum.Progress `gorm:"type:progress" json:"status"`
	ApproveOwnerID *string       `gorm:"type:uuid" json:"approve_owner_id"`
	ApproveOwner   *ClubMember   `gorm:"foreignKey:ApproveOwnerID" json:"approve_owner"`
	UserID         string        `gorm:"type:uuid;not null" json:"user_id"`
	User           User          `gorm:"foreignKey:UserID" json:"user"`
	OrderItems     []OrderItem   `gorm:"foreignKey:OrderID" json:"order_items"`
}

func (Order) TableName() string {
	return OrderTN
}
