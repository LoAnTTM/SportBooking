package utils

import (
	"errors"
	"fmt"
	"strings"
	"time"
)

type CustomDatetime struct {
	Time   *time.Time
	Format *string
}

// @author: LoanTT
// @function: ParseInputDatetime
// @description: Parse datetime
// @param: datetime string
// @return: time.Time, error
func ParseInputDatetime(datetime string) (*time.Time, error) {
	var err error
	newTime := time.Time{}

	dateFormats := []string{
		time.RFC3339,
		time.UnixDate,
		time.RFC822Z,
		"2006-01-02",
		"2006-01-02 15:04",
		"2006-01-02 15:04:05",
	}
	for _, format := range dateFormats {
		if newTime, err = time.Parse(format, datetime); err == nil {
			return &newTime, nil
		}
	}
	return nil, fmt.Errorf("failed to parse given datetime: %s", datetime)
}

// @author: LoanTT
// @function: UnmarshalJSON
// @description: Unmarshal JSON
// @param: input []byte
// @return: error
func (t *CustomDatetime) UnmarshalJSON(input []byte) error {
	strInput := strings.Trim(string(input), `"`)
	parsedTime, err := ParseInputDatetime(strInput)
	if err == nil {
		t.Time = parsedTime
	}
	return err
}

// @author: LoanTT
// @function: MarshalJSON
// @description: Marshal JSON
// @param: input []byte
// @return: error
func (t CustomDatetime) MarshalJSON() ([]byte, error) {
	var jsonDatetime string
	if t.Format == nil {
		jsonDatetime = fmt.Sprintf("%q", t.Time.Format(time.RFC3339))
		return []byte(jsonDatetime), nil
	}
	return []byte(`"` + jsonDatetime + `"`), nil
}

// @author: LoanTT
// @function: Value
// @description: Value
// @return: time.Time, error
func (t CustomDatetime) Value() (time.Time, error) {
	return time.Time(*t.Time), nil
}

// @author: LoanTT
// @function: Scan
// @description: Scan
// @param: src interface{}
// @return: error
func (t *CustomDatetime) Scan(src interface{}) error {
	if val, ok := src.(time.Time); ok {
		t.Time = &val
	} else {
		return errors.New("time Scanner passed a non-time object")
	}
	return nil
}

// @author: LoanTT
// @function: Timer
// @description: Timer
// @param: start time.Time
// @return: func()
func Timer(start time.Time) func() {
	return func() {
		duration := time.Since(start)
		fmt.Printf("duration: %+v\n", duration)
	}
}

// @author: LoanTT
// @function: ExpireTime
// @description: Expire time
// @param: expire int
// @return: time.Time
func ExpireTime(expire int) time.Time {
	return time.Now().Add(time.Minute * time.Duration(expire))
}
