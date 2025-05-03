package model

import (
	"strings"

	"spb/bsa/pkg/utils"
)

// @queries: i=?&p=?&b=?&t=?&r=?
// &i = items
// &p = page
// &b = order by
// &t = order type
// &r = role
type UserPagination struct {
	utils.Pagination
	Role string `json:"role"`
}

func GetPagination(queries map[string]string) *UserPagination {
	pagination := utils.GetPagination(queries, ORDER_BY)
	unitPagination := new(UserPagination)
	unitPagination.Pagination = pagination

	if queries["r"] != "" {
		unitPagination.Role = strings.ToLower(queries["r"])
	}

	return unitPagination
}

// @author: LoanTT
// @function: SetNewUserPagination
// @description: set new pagination info (total_page, total pages, next, prev)
// @param: int total_page
func (up *UserPagination) SetNewUserPagination(total_page int) {
	up.SetNewPagination(total_page)
	up.nextUnitPageUrl()
	up.prevUnitPageUrl()
}

// @author: LoanTT
// @function: nextUnitPageUrl
// @description: set next page url
func (up *UserPagination) nextUnitPageUrl() {
	if up.NextPage != "" {
		up.NextPage = addOtherQueries(up.NextPage, up)
	}
}

// @author: LoanTT
// @function: prevUnitPageUrl
// @description: set prev page url
func (up *UserPagination) prevUnitPageUrl() {
	if up.PrevPage != "" {
		up.PrevPage = addOtherQueries(up.PrevPage, up)
	}
}

func addOtherQueries(url string, up *UserPagination) string {
	url = utils.ConcatenateQueries(url, "r", up.Role)
	return url
}
