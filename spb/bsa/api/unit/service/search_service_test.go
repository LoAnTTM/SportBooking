package service

import (
	"reflect"
	"testing"

	am "spb/bsa/api/address/model"
	tb "spb/bsa/pkg/entities"
)

func TestSortUnitsByDistance(t *testing.T) {
	// Create test data
	unit1 := &tb.Unit{Base: tb.Base{ID: "1"}, AddressID: "addr1"}
	unit2 := &tb.Unit{Base: tb.Base{ID: "2"}, AddressID: "addr2"}
	unit3 := &tb.Unit{Base: tb.Base{ID: "3"}, AddressID: "addr3"}
	unit4 := &tb.Unit{Base: tb.Base{ID: "4"}, AddressID: "addr4"} // No distance info

	// Create address distances
	addr1 := &am.AddressWithDistance{Address: tb.Address{Base: tb.Base{ID: "addr1"}}, Distance: 100.0}
	addr2 := &am.AddressWithDistance{Address: tb.Address{Base: tb.Base{ID: "addr2"}}, Distance: 50.0}
	addr3 := &am.AddressWithDistance{Address: tb.Address{Base: tb.Base{ID: "addr3"}}, Distance: 200.0}

	// Test cases
	tests := []struct {
		name             string
		units            []*tb.Unit
		addressDistances []*am.AddressWithDistance
		expected         []*tb.Unit
	}{
		{
			name:             "Empty units",
			units:            []*tb.Unit{},
			addressDistances: []*am.AddressWithDistance{addr1, addr2, addr3},
			expected:         []*tb.Unit{},
		},
		{
			name:             "Empty address distances",
			units:            []*tb.Unit{unit1, unit2, unit3},
			addressDistances: []*am.AddressWithDistance{},
			expected:         []*tb.Unit{unit1, unit2, unit3},
		},
		{
			name:             "Sort by distance",
			units:            []*tb.Unit{unit1, unit2, unit3},
			addressDistances: []*am.AddressWithDistance{addr1, addr2, addr3},
			expected:         []*tb.Unit{unit2, unit1, unit3}, // Sorted by distance: 50, 100, 200
		},
		{
			name:             "Units with missing distance info",
			units:            []*tb.Unit{unit1, unit2, unit3, unit4},
			addressDistances: []*am.AddressWithDistance{addr1, addr2, addr3},
			expected:         []*tb.Unit{unit2, unit1, unit3, unit4}, // Units with distance info come first
		},
	}

	// Run tests
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			result := SortUnitsByDistance(tt.units, tt.addressDistances)
			if !reflect.DeepEqual(result, tt.expected) {
				t.Errorf("SortUnitsByDistance() = %v, want %v", result, tt.expected)
			}
		})
	}
}
