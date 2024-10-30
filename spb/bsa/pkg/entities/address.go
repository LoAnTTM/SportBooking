package entities

import "fmt"

var AddressTN = "address"

type Address struct {
	Base
	UnitID            string   `gorm:"type:uuid;not null" json:"unit_id"`
	Address           string   `gorm:"size:255;not null" json:"address"`
	LocationGeography string   `gorm:"type:geography(Point, 4326);not null" json:"location_geography"`
	LocationID        string   `gorm:"type:uuid;not null" json:"location_id"`
	Location          Location `gorm:"foreignKey:LocationID" json:"location"`
}

func (Address) TableName() string {
	return AddressTN
}

func (a *Address) GetGeography() (longitude, latitude float64) {
	_, err := fmt.Sscanf(a.LocationGeography, "POINT(%f %f)", &longitude, &latitude)
	if err != nil {
		return 0, 0
	}
	return
}

func (a *Address) SetGeography(longitude, latitude float64) {
	a.LocationGeography = fmt.Sprintf("POINT(%f %f)", longitude, latitude)
}
