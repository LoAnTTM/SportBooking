package utils

import (
	"fmt"
	"strconv"

	"gorm.io/gorm"
)

const DEFAULT_SORT_KEY = "created_at"

// @queries: i=?&p=?&b=?&t=?
// &i = items
// &p = page
// &b = order by
// &t = order type
type Pagination struct {
	Page       int    `json:"page"`        // current page
	PageItems  int    `json:"page_items"`  // number item per page
	OrderBy    string `json:"order_by"`    // order by
	OrderType  string `json:"order_type"`  // order type
	TotalItems int    `json:"total_items"` // total items
	TotalPages int    `json:"total_pages"` // total pages (total_items / items per page)
	NextPage   string `json:"next_page"`
	PrevPage   string `json:"prev_page"`
}

// @author: LoanTT
// @function: getDefaultPagination
// @description: default pagination
// @return: *Pagination
func getDefaultPagination() *Pagination {
	return &Pagination{
		Page:       1,
		TotalItems: 0,
		OrderBy:    DEFAULT_SORT_KEY,
		OrderType:  "desc",
		TotalPages: 0,
		PageItems:  50,
		NextPage:   "",
		PrevPage:   "",
	}
}

// @author: LoanTT
// @function: verifyOrderBy
// @description: verify order by key
// @param: string
// @param: []string
// @return: string
func verifyOrderBy(orderBy string, orderByOptions []string) string {
	isValid := false
	for _, option := range orderByOptions {
		if option == orderBy {
			isValid = true
		}
	}
	if !isValid {
		return DEFAULT_SORT_KEY
	}
	return orderBy
}

// @function: verifyOrderType
// @description: verify order type
// @param: string
// @return: string
func verifyOrderType(orderType string) string {
	if orderType == "asc" || orderType == "desc" {
		return orderType
	}
	return "desc"
}

// @author: LoanTT
// @function: SetNewPagination
// @description: set new pagination info (totalItem, total pages, next, prev)
// @param: int totalItem
func (p *Pagination) SetNewPagination(totalItem int) {
	// convert float number to floor number
	p.TotalPages = CeilFloatToInt(float64(totalItem) / float64(p.PageItems))
	p.TotalItems = totalItem

	p.NextPageUrl()
	p.PrevPageUrl()
}

// @author: LoanTT
// @function: nextPageUrl
// @description: set next page url
func (p *Pagination) NextPageUrl() {
	var nextPageUrl string
	if p.Page < p.TotalPages {
		nextPageUrl = fmt.Sprintf("i=%d&p=%d&b=%s&t=%s", p.PageItems, p.Page+1, p.OrderBy, p.OrderType)
	}
	p.NextPage = nextPageUrl
}

// @author: LoanTT
// @function: prevPageUrl
// @description: set prev page url
func (p *Pagination) PrevPageUrl() {
	var prevPageUrl string
	if p.Page > 1 {
		prevPageUrl = fmt.Sprintf("i=%d&p=%d&b=%s&t=%s", p.PageItems, p.Page-1, p.OrderBy, p.OrderType)
	}
	p.PrevPage = prevPageUrl
}

// @author: LoanTT
// @function: GetPagination
// @description: get pagination
// @param: map[string]string
// @return: Pagination
func GetPagination(queries map[string]string, orderByOptions []string) Pagination {
	pagination := getDefaultPagination()

	if queries["p"] != "" && queries["i"] != "" {
		pagination.Page, _ = strconv.Atoi(queries["p"])
		pagination.PageItems, _ = strconv.Atoi(queries["i"])
	}
	if pagination.Page < 1 {
		pagination.Page = 1
	}
	if queries["b"] != "" && queries["t"] != "" {
		pagination.OrderType = verifyOrderType(queries["t"])
		if len(orderByOptions) == 0 {
			pagination.OrderBy = DEFAULT_SORT_KEY
		}
		pagination.OrderBy = verifyOrderBy(queries["b"], orderByOptions)
	}

	return *pagination
}

// @author: LoanTT
// @function: Paginate
// @description: paginate
// @param: *Pagination
// @return: func(*gorm.DB) *gorm.DB
func Paginate(p *Pagination) func(*gorm.DB) *gorm.DB {
	return func(db *gorm.DB) *gorm.DB {
		offset := int((p.Page - 1) * p.PageItems)
		return db.Offset(offset).Limit(p.PageItems).Order(fmt.Sprintf("%s %s", p.OrderBy, p.OrderType))
	}
}

// @author: LoanTT
// @function: ConcatenateQueries
// @description: concatenate queries with alias and value
// @param: string prevQuery
// @param: string alias
// @param: string value
// @return: string query
func ConcatenateQueries(prevQuery, alias, value string) string {
	if value != "" {
		return fmt.Sprintf("%s&%s=%s", prevQuery, alias, value)
	}
	return prevQuery
}
