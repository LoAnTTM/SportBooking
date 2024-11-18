package config

const (
	ACCESS_TOKEN_NAME  = "x-a"
	REFRESH_TOKEN_NAME = "x-r"
	BLACKLIST_PREFIX   = "bl-"
	JWT_PREFIX         = "Bearer " // has a white space

	// cache type
	VERIFY_TOKEN_CACHE = "VERIFY:TOKEN"

	// notification type
	VERIFY_USER_NT    = "VERIFY:USER"
	RESET_PASSWORD_NT = "RESET:PASSWORD"

	// metadata keys
	OPERATOR_EMAIL_KEY = "operator_email"
)
