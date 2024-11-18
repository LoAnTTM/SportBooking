package utils

type JSONResult struct {
	Status string      `json:"status"`
	Code   string      `json:"code"`
	Data   interface{} `json:"data"`
}
