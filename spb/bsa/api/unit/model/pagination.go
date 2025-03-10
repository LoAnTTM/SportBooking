package model

import (
	"spb/bsa/pkg/utils"
)

// @queries: i=?&p=?&b=?&t=?&q=?&st=?&pv=?&ct=?&dt=?
// &i = items
// &p = page
// &b = order by
// &t = order type
// &q = query
// &st = sport type
// &pv = province
// &ct = city
// &dt = district
type UnitPagination struct {
	utils.Pagination
	Query     string `json:"query"`
	SportType string `json:"sport_type"`
	Province  string `json:"province"`
	City      string `json:"city"`
	District  string `json:"district"`
}

func GetPagination(queries map[string]string) *UnitPagination {
	pagination := utils.GetPagination(queries, ORDER_BY)
	unitPagination := new(UnitPagination)
	unitPagination.Pagination = pagination

	if queries["q"] != "" {
		unitPagination.Query = queries["q"]
	}
	if queries["st"] != "" {
		unitPagination.SportType = queries["st"]
	}
	if queries["pv"] != "" {
		unitPagination.Province = queries["pv"]
	}
	if queries["ct"] != "" {
		unitPagination.City = queries["ct"]
	}
	if queries["dt"] != "" {
		unitPagination.District = queries["dt"]
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
	up.NextPageUrl()
	up.NextPage = addOtherQueries(up.NextPage, up)
}

// @author: LoanTT
// @function: prevUnitPageUrl
// @description: set prev page url
func (up *UnitPagination) prevUnitPageUrl() {
	up.PrevPageUrl()
	up.PrevPage = addOtherQueries(up.PrevPage, up)
}

func addOtherQueries(url string, up *UnitPagination) string {
	url = utils.ConcatenateQueries(url, "q", up.Query)
	url = utils.ConcatenateQueries(url, "st", up.SportType)
	url = utils.ConcatenateQueries(url, "pv", up.Province)
	url = utils.ConcatenateQueries(url, "ct", up.City)
	url = utils.ConcatenateQueries(url, "dt", up.District)
	return url
}
