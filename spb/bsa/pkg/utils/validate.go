package utils

import (
	"regexp"

	"github.com/go-playground/validator/v10"
)

// @author: LoanTT
// @function: NewValidator
// @description: Create a new validator
// @return: (*validator.Validate, error)
func NewValidator() (*validator.Validate, error) {
	validateInstance := validator.New()

	// register custom validation
	err := validateInstance.RegisterValidation("yy:mm", validateYYMM)
	if err != nil {
		return nil, err
	}

	err = validateInstance.RegisterValidation("password", validatePassword)
	if err != nil {
		return nil, err
	}

	return validateInstance, nil
}

// @author: LoanTT
// @function: Regular expression to match "yy:mm" format (e.g., "23:08")
// @description: validate "yy:mm" format
// @param: fl validator.FieldLevel
// @return: bool
func validateYYMM(fl validator.FieldLevel) bool {
	regex := `^\d{2}:\d{2}$`
	matched, _ := regexp.MatchString(regex, fl.Field().String())
	return matched
}

// @function: validatePassword
// @description: validate password must have a capital letter, special letter, number, and lowercase letter
// @param: fl validator.FieldLevel
// @return: bool
func validatePassword(fl validator.FieldLevel) bool {
	password := fl.Field().String()
	hasLower := regexp.MustCompile(`[a-z]`).MatchString(password)
	hasUpper := regexp.MustCompile(`[A-Z]`).MatchString(password)
	hasNumber := regexp.MustCompile(`\d`).MatchString(password)
	hasSpecial := regexp.MustCompile(`[@$!%*?&]`).MatchString(password)
	return hasLower && hasUpper && hasNumber && hasSpecial
}
