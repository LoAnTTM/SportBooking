package model

import (
	"strings"

	"spb/bsa/pkg/utils"
)

// @queries: i=?&p=?&b=?&t=?&q=?&st=?&pv=?&wd=?&dt=?&lng=?&lat=?&r=?
// &i = items
// &p = page
// &b = order by
// &t = order type
// &q = query
// &st = sport type
// &pv = province
// &wd = ward
// &dt = district
// &lng = longitude
// &lat = latitude
// &r = radius
type UnitPagination struct {
	utils.Pagination
	Query     string  `json:"query"`
	SportType string  `json:"sport_type"`
	Province  string  `json:"province"`
	Ward      string  `json:"ward"`
	District  string  `json:"district"`
	Longitude float64 `json:"longitude"`
	Latitude  float64 `json:"latitude"`
	Radius    int     `json:"radius"`
}

func GetPagination(queries map[string]string) *UnitPagination {
	pagination := utils.GetPagination(queries, ORDER_BY)
	unitPagination := new(UnitPagination)
	unitPagination.Pagination = pagination

	if queries["q"] != "" {
		unitPagination.Query = strings.ToLower(queries["q"])
	}
	if queries["st"] != "" {
		unitPagination.SportType = queries["st"]
	}
	if queries["pv"] != "" {
		unitPagination.Province = queries["pv"]
	}
	if queries["wd"] != "" {
		unitPagination.Ward = queries["wd"]
	}
	if queries["dt"] != "" {
		unitPagination.District = queries["dt"]
	}
	if queries["lng"] != "" {
		unitPagination.Longitude = utils.StringToFloat64(queries["lng"])
	}
	if queries["lat"] != "" {
		unitPagination.Latitude = utils.StringToFloat64(queries["lat"])
	}
	if queries["r"] != "" {
		unitPagination.Radius = utils.StringToInt(queries["r"])
	}

	return unitPagination
}

// @author: LoanTT
// @function: SetNewUnitPagination
// @description: set new pagination info (total_page, total pages, next, prev)
// @param: int total_page
func (up *UnitPagination) SetNewUnitPagination(total_page int) {
	up.SetNewPagination(total_page)
	up.nextUnitPageUrl()
	up.prevUnitPageUrl()
}

// @author: LoanTT
// @function: nextUnitPageUrl
// @description: set next page url
func (up *UnitPagination) nextUnitPageUrl() {
	if up.NextPage != "" {
		up.NextPage = addOtherQueries(up.NextPage, up)
	}
}

// @author: LoanTT
// @function: prevUnitPageUrl
// @description: set prev page url
func (up *UnitPagination) prevUnitPageUrl() {
	if up.PrevPage != "" {
		up.PrevPage = addOtherQueries(up.PrevPage, up)
	}
}

func addOtherQueries(url string, up *UnitPagination) string {
	url = utils.ConcatenateQueries(url, "q", up.Query)
	url = utils.ConcatenateQueries(url, "st", up.SportType)
	url = utils.ConcatenateQueries(url, "pv", up.Province)
	url = utils.ConcatenateQueries(url, "dt", up.District)
	url = utils.ConcatenateQueries(url, "wd", up.Ward)
	url = utils.ConcatenateQueries(url, "lng", utils.Float64ToString(up.Longitude))
	url = utils.ConcatenateQueries(url, "lat", utils.Float64ToString(up.Latitude))
	url = utils.ConcatenateQueries(url, "r", utils.IntToString(up.Radius))
	return url
}
