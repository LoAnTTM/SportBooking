package service

import (
	"fmt"

	address "spb/bsa/api/address"
	au "spb/bsa/api/address/utility"
	"spb/bsa/api/unit/model"
	tb "spb/bsa/pkg/entities"
	"spb/bsa/pkg/msg"
)

func (s *Service) GetPopularity(reqBody *model.PopularityRequest) ([]*tb.Unit, error) {
	var units []*tb.Unit
	var unitIds []model.UnitIDOnly

	// Validate request
	if reqBody.Limit <= 0 {
		reqBody.Limit = 10
	}

	if reqBody.TopN <= 0 || reqBody.TopN > 365 {
		reqBody.TopN = 30
	}

	// Get units in radius
	addresses, err := address.AddressService.SearchByGeography(reqBody.Longitude, reqBody.Latitude, reqBody.Radius)
	if err != nil {
		return nil, err
	}
	if len(addresses) == 0 {
		return units, nil
	}
	addressIds := au.MapAddressEntitiesToIDs(addresses)

	intervalStr := fmt.Sprintf("INTERVAL '%d days'", reqBody.TopN)
	query := fmt.Sprintf(`
	SELECT
		u.id,
		COUNT(b.order_id) AS order_count
	FROM
		unit u
	LEFT JOIN (
		SELECT
			o.id AS order_id,
			oi.item_id AS unit_id
		FROM
			"order" o
		JOIN order_item oi ON o.id = oi.order_id
		WHERE
			TO_DATE(oi.booking_day, 'YYYY-MM-DD') >= NOW() - %s
			AND o.status = 'success'
	) b ON u.id = b.unit_id
	WHERE
		u.status = 1 AND
		u.address_id IN ?
	GROUP BY
		u.id, u.name
	ORDER BY
		order_count DESC
	LIMIT ?;
	`, intervalStr)
	if err := s.db.Raw(query, addressIds, reqBody.Limit).Scan(&unitIds).Error; err != nil {
		return nil, err
	}

	// Get units
	err = s.db.Preload("Media").
		Preload("UnitPrice").Find(&units).Error
	if err != nil {
		return nil, err
	}

	// Get address
	for i := 0; i < len(units); i++ {
		units[i].Address, err = address.AddressService.GetAddressByID(units[i].AddressID)
		if err != nil {
			return nil, msg.ErrNotFound("Address")
		}
	}
	return units, nil
}
