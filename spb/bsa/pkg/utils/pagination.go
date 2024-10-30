package utils

import (
	"fmt"
	"strconv"

	"gorm.io/gorm"
)

// @queries: i=?&p=?&b=?&t=?
// @i = items
// @p = page
// @b = order by
// @t = order type
type Pagination struct {
	Page       int    `json:"page,omitempty"`        // current page
	Items      int    `json:"items,omitempty"`       // number item per page
	OrderBy    string `json:"order_by,omitempty"`    // order by
	OrderType  string `json:"order_type,omitempty"`  // order type
	Count      int    `json:"count,omitempty"`       // total items
	TotalPages int    `json:"total_pages,omitempty"` // total pages (count / items)
	NextPage   string `json:"next_page,omitempty"`
	PrevPage   string `json:"prev_page,omitempty"`
}

// @author: LoanTT
// @function: defaultSortKey
// @description: default sort key
// @return: string
func defaultSortKey() string {
	defaultSortKey := "created_at"
	return defaultSortKey
}

// @author: LoanTT
// @function: getDefaultPagination
// @description: default pagination
// @return: *Pagination
func getDefaultPagination() *Pagination {
	return &Pagination{
		Page:       1,
		Count:      0,
		OrderBy:    defaultSortKey(),
		OrderType:  "desc",
		TotalPages: 0,
		Items:      50,
		NextPage:   "",
		PrevPage:   "",
	}
}

// @author: LoanTT
// @function: SetPagination
// @description: set pagination info (count, total pages, next, prev)
// @param: int count
func (p *Pagination) SetPagination(count int) {
	p.TotalPages = count / p.Items
	p.Count = count
	if count%int(p.Items) > 0 {
		p.TotalPages++
	}
	p.nextPageUrl()
	p.prevPageUrl()
}

// @author: LoanTT
// @function: nextPageUrl
// @description: set next page url
func (p *Pagination) nextPageUrl() {
	var nextPageUrl string
	if p.Page < p.TotalPages {
		nextPageUrl = fmt.Sprintf("i=%d&p=%d&b=%s&t=%s", p.Items, p.Page+1, p.OrderBy, p.OrderType)
	}
	p.NextPage = nextPageUrl
}

// @author: LoanTT
// @function: prevPageUrl
// @description: set prev page url
func (p *Pagination) prevPageUrl() {
	var prevPageUrl string
	if p.Page > 1 {
		prevPageUrl = fmt.Sprintf("i=%d&p=%d&b=%s&t=%s", p.Items, p.Page-1, p.OrderBy, p.OrderType)
	}
	p.PrevPage = prevPageUrl
}

// @author: LoanTT
// @function: GetPagination
// @description: get pagination
// @param: map[string]string
// @return: *Pagination
func GetPagination(queries map[string]string) Pagination {
	pagination := getDefaultPagination()

	if queries["p"] != "" && queries["i"] != "" {
		pagination.Page, _ = strconv.Atoi(queries["p"])
		pagination.Items, _ = strconv.Atoi(queries["i"])
	}
	if pagination.Page < 1 {
		pagination.Page = 1
	}
	if queries["b"] != "" && queries["y"] != "" {
		pagination.OrderBy = queries["b"]
		pagination.OrderType = queries["y"]
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
		offset := int((p.Page - 1) * p.Items)
		return db.Offset(offset).Limit(p.Items)
	}
}
