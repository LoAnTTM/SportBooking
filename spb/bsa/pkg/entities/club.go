package entities

var ClubTN = "club"

type Club struct {
	Base
	Name         string        `gorm:"size:255;not null;uniqueIndex" json:"name"`
	Slug         string        `gorm:"size:255;not null" json:"slug"`
	OpenTime     string        `gorm:"size:5;not null" json:"open_time"`
	CloseTime    string        `gorm:"size:5;not null" json:"close_time"`
	OwnerID      string        `gorm:"type:uuid;not null" json:"owner_id"`
	Owner        User          `gorm:"foreignKey:OwnerID" json:"owner"`
	Media        []Media       `gorm:"many2many:club_media;" json:"media"`
	PaymentInfos []PaymentInfo `gorm:"many2many:club_payment_infos;" json:"payment_infos"`
	Units        []*Unit       `gorm:"foreignKey:ClubID" json:"units"`
	SportTypes   []*SportType  `gorm:"many2many:club_sporttype;" json:"sport_types"`
}

func (Club) TableName() string {
	return ClubTN
}
