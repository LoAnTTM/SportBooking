package entities

import (
	"fmt"

	"gorm.io/gorm"
)

const ClubTN = "club"

type Club struct {
	Base
	Name        string       `gorm:"size:255;not null;uniqueIndex" json:"name"`
	NameEn      string       `gorm:"size:255;not null" json:"name_en"`
	Slug        string       `gorm:"size:255;not null" json:"slug"`
	OpenTime    string       `gorm:"size:5;not null" json:"open_time"`
	CloseTime   string       `gorm:"size:5;not null" json:"close_time"`
	OwnerID     string       `gorm:"type:uuid;not null" json:"owner_id"`
	Owner       *User        `gorm:"foreignKey:OwnerID" json:"owner"`
	Phone       string       `gorm:"size:20;not null" json:"phone"`
	AddressID   string       `gorm:"type:uuid;not null" json:"address_id"`
	Address     *Address     `gorm:"foreignKey:AddressID;constraint:OnDelete:RESTRICT" json:"address"`
	Description string       `gorm:"size:3000" json:"description"`
	Media       []*Media     `gorm:"polymorphic:Owner;polymorphicValue:club" json:"media"`
	Units       []*Unit      `gorm:"foreignKey:ClubID;constraint:OnDelete:CASCADE" json:"units"`
	SportTypes  []*SportType `gorm:"many2many:club_sporttype;constraint:OnDelete:CASCADE" json:"sport_types"`
}

func (Club) TableName() string {
	return ClubTN
}

func (c *Club) AfterDelete(tx *gorm.DB) error {
	// Delete associated addresses
	if err := tx.Delete(&Address{}, "id = ?", c.AddressID).Error; err != nil {
		return err
	}

	// Delete associated media using the polymorphic relationship
	if err := tx.Where("owner_id = ? AND owner_type = ?", c.ID, "club").
		Delete(&Media{}).Error; err != nil {
		return fmt.Errorf("failed to delete media records: %w", err)
	}
	return nil
}
