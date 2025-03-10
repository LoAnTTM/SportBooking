package config

const (
	ACCESS_TOKEN_NAME  = "x-a"
	REFRESH_TOKEN_NAME = "x-r"
	JWT_PREFIX         = "Bearer " // has a whitespace

	// metadata keys
	OPERATOR_EMAIL_KEY = "operator_email"
)

const (
	// auth token type
	AUTH_REFRESH_TOKEN           = "A:RT:"
	AUTH_REFRESH_TOKEN_BLACKLIST = "A:RT:BL:"

	// notification type
	AUTH_VERIFY_EMAIL   = "A:VE:"
	AUTH_RESET_PASSWORD = "A:RP:"

	// otp type
	AUTH_OTP = "A:OTP:"
)
