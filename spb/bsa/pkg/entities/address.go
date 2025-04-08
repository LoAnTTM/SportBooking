package entities

import (
	"context"
	"encoding/json"
	"fmt"

	geojson "github.com/paulmach/go.geojson"
	"gorm.io/gorm"
	"gorm.io/gorm/clause"
)

var AddressTN = "address"

type Address struct {
	Base
	Address           string   `gorm:"size:255;not null" json:"address"`
	LocationGeography GeoPoint `gorm:"column:location_geography" json:"location_geography"`
	WardID            string   `gorm:"type:uuid;not null" json:"ward_id"`
	Ward              Ward     `gorm:"foreignKey:WardID" json:"location"`
}

func (Address) TableName() string {
	return AddressTN
}

type GeoPoint struct {
	Type        string     `json:"type"`
	Coordinates [2]float64 `json:"coordinates"`
}

func (g GeoPoint) GormDataType() string {
	return "geography(Point, 4326)"
}

func (g GeoPoint) GormDBDataType() string {
	return "geometry(Point, 4326)"
}

func (g GeoPoint) GormValue(ctx context.Context, db *gorm.DB) clause.Expr {
	if len(g.Type) == 0 {
		return clause.Expr{
			SQL: "NULL",
		}
	}

	geoJSONBytes, err := json.Marshal(g)
	if err != nil {
		return clause.Expr{SQL: "NULL"}
	}

	return clause.Expr{
		SQL:  "ST_SetSRID(ST_GeomFromGeoJSON(?),4326)",
		Vars: []interface{}{string(geoJSONBytes)},
	}
}

func (g *GeoPoint) Scan(input interface{}) error {
	switch value := input.(type) {
	case []byte:
		geom := &geojson.Geometry{}
		err := json.Unmarshal(value, geom)
		if err != nil {
			return fmt.Errorf("can't unmarshal GeoJSON: %w", err)
		}

		if geom.Type != geojson.GeometryPoint {
			return fmt.Errorf("expected point geometry, got %s", geom.Type)
		}

		g.Type = string(geom.Type)
		if len(geom.Point) >= 2 {
			g.Coordinates[0] = geom.Point[0] // longitude
			g.Coordinates[1] = geom.Point[1] // latitude
		}

	case string:
		return g.Scan([]byte(value))

	default:
		return fmt.Errorf("can't convert %T to GeoJSON", value)
	}

	return nil
}
