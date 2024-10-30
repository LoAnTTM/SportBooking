package utils

type JSONResult struct {
	Message *string     `json:"message,omitempty"`
	Data    interface{} `json:"data"`
}

type ErrorResult struct {
	Message string `json:"message"`
}
