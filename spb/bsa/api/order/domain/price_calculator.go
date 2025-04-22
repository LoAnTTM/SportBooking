package domain

import (
	"fmt"
	"time"
)

type PriceCalculator struct{}

func NewPriceCalculator() *PriceCalculator {
	return &PriceCalculator{}
}

func (pc *PriceCalculator) CalculateTimeRanges(booking *Booking) ([]TimeRange, error) {
	var timeRanges []TimeRange

	currentTime := booking.StartTime

	for currentTime.Before(booking.EndTime) {
		var matched bool

		for _, unitPrice := range booking.Unit.UnitPrice {
			unitPriceStartTime, err := time.Parse("15:04", unitPrice.StartTime)
			if err != nil {
				return nil, err
			}
			unitPriceEndTime, err := time.Parse("15:04", unitPrice.EndTime)
			if err != nil {
				return nil, err
			}

			// Normalize unitPrice times to the current day
			unitPriceStart := time.Date(currentTime.Year(), currentTime.Month(), currentTime.Day(),
				unitPriceStartTime.Hour(), unitPriceStartTime.Minute(), 0, 0, currentTime.Location())
			unitPriceEnd := time.Date(currentTime.Year(), currentTime.Month(), currentTime.Day(),
				unitPriceEndTime.Hour(), unitPriceEndTime.Minute(), 0, 0, currentTime.Location())

			// If current time is within this unit price range
			if !currentTime.Before(unitPriceStart) && currentTime.Before(unitPriceEnd) {
				end := booking.EndTime
				if unitPriceEnd.Before(booking.EndTime) {
					end = unitPriceEnd
				}

				tr := TimeRange{
					StartTime: currentTime,
					EndTime:   end,
					Price:     unitPrice.Price,
				}
				tr.CalculateAmount()
				timeRanges = append(timeRanges, tr)

				currentTime = end
				matched = true
				break
			}
		}

		if !matched {
			return nil, fmt.Errorf("no matching price range found for time %v", currentTime)
		}
	}

	return timeRanges, nil
}
