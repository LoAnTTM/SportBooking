package entities

var UnitTN = "unit"

type Unit struct {
	Base
	Name         string        `gorm:"size:255;not null;uniqueIndex" json:"name"`
	OpenTime     string        `gorm:"size:5;not null" json:"open_time"`
	CloseTime    string        `gorm:"size:5;not null" json:"close_time"`
	Phone        string        `gorm:"size:25;not null" json:"phone"`
	Description  string        `gorm:"type:text" json:"description"`
	Status       int8          `gorm:"not null" json:"status"`
	ClubID       string        `gorm:"type:uuid;not null" json:"club_id"`
	Address      Address       `gorm:"foreignKey:UnitID;" json:"address"`
	UnitPrice    []UnitPrice   `gorm:"foreignKey:UnitID" json:"unit_price"`
	UnitServices []UnitService `gorm:"foreignKey:UnitID" json:"unit_services"`
	Media        []Media       `gorm:"many2many:unit_media;" json:"media"`
	SportTypes   []SportType   `gorm:"many2many:unit_sporttype;" json:"sport_types"`
}

func (Unit) TableName() string {
	return UnitTN
}
