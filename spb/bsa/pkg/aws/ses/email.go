package ses

type EmailInfo struct {
	ID      string   `json:"id"`
	From    string   `json:"from"`
	To      []string `json:"to"`
	Cc      []string `json:"cc,omitempty"`
	Bcc     []string `json:"bcc,omitempty"`
	Title   string   `json:"title"`
	Charset string   `json:"charset"`
	Message string   `json:"message"`
}
