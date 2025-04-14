package utils

import (
	"crypto/hmac"
	"crypto/sha256"
	"encoding/hex"
	"encoding/json"
	"fmt"
	"math"
	"math/rand"
	"path"
	"path/filepath"
	"regexp"
	"runtime"
	"strconv"
	"strings"
	"time"

	"golang.org/x/crypto/bcrypt"
)

// @author: LoanTT
// @function: RootDir
// @description: get root path
// @return: string
func RootDir(level int) string {
	parentPath := ""
	for p := 0; p < level; p++ {
		parentPath += "../"
	}
	_, b, _, _ := runtime.Caller(0)
	d := path.Join(path.Dir(b), parentPath)
	return filepath.Dir(d)
}

// @author: LoanTT
// @function: GetRandString
// @description: get random string
// @return: string
func GetRandString(length int) string {
	if length < 1 {
		length = 1
	}

	b := make([]byte, length)
	bytes, err := rand.Read(b)
	if err != nil || bytes != length {
		return ""
	}
	return fmt.Sprintf("%x", b)
}

// @author: LoanTT
// @function: HashPassword
// @description: hash password
// @return: string
func HashPassword(pwd string) string {
	hash, err := bcrypt.GenerateFromPassword([]byte(pwd), bcrypt.MinCost)
	if err != nil {
		fmt.Printf("failed to bcrypt.GenerateFromPassword: %v\n", err)
	}
	return string(hash)
}

// @author: LoanTT
// @function: ToPtr
// @description: convert to pointer
// @return: *T
func ToPtr[T any](v T) *T {
	return &v
}

// @author: LoanTT
// @function: ToSlicePtr
// @description: convert to slice pointer
// @return: []*T
func ToSlicePtr[T any](v []T) []*T {
	newSlicePtr := make([]*T, len(v))

	for i := 0; i < len(v); i++ {
		newSlicePtr[i] = &v[i]
	}
	return newSlicePtr
}

// @author: LoanTT
// @function: Defer
// @description: defer
// @return: T
func Defer[T any](v *T) T {
	return *v
}

// @author: LoanTT
// @function: IsSubSet
// @description: check (subSet) is subset of (originalSet)
// @param: subSet, originalSet []string
// @return: bool
func IsSubSet(subSet, originalSet []string) bool {
	for subCID := range subSet {
		hasSubItem := false
		for setCID := range originalSet {
			if subSet[subCID] == originalSet[setCID] {
				hasSubItem = true
				break
			}
		}

		if !hasSubItem {
			return false
		}
	}
	return true
}

// @author: LoanTT
// @function: ContainsString
// @description: check if val is in arr
// @param: arr []T
// @param: val T
// @return: bool
func ContainsItem[T string | int](arr []T, val T) bool {
	for _, item := range arr {
		if item == val {
			return true
		}
	}
	return false
}

// @author: LoanTT
// @function: ContainBit
// @description: check if bit contain val
// @param: bit uint64
// @param: val uint64
// @return: bool
func ContainBit(bit, val uint64) bool {
	return bit&val == val
}

// @author: LoanTT
// @function: CreateSlug
// @description: create slug
// @param: val string
// @return: string
func CreateSlug(val string) string {
	slug := VietNameseCharacterToASCII(val)

	splitRegex := regexp.MustCompile(`(\s+)`)
	slug = splitRegex.ReplaceAllString(slug, "-")

	splitsRegex := regexp.MustCompile(`-+`)
	slug = splitsRegex.ReplaceAllString(slug, "-")

	return strings.Trim(slug, "-")
}

func VietNameseCharacterToASCII(val string) string {
	slug := strings.ToLower(val)
	aRegex := regexp.MustCompile(`(à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ)`)
	slug = aRegex.ReplaceAllString(slug, "a")

	eRegex := regexp.MustCompile(`(è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ)`)
	slug = eRegex.ReplaceAllString(slug, "e")

	iRegex := regexp.MustCompile(`(ì|í|ị|ỉ|ĩ)`)
	slug = iRegex.ReplaceAllString(slug, "i")

	oRegex := regexp.MustCompile(`(ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ)`)
	slug = oRegex.ReplaceAllString(slug, "o")

	uRegex := regexp.MustCompile(`(ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ)`)
	slug = uRegex.ReplaceAllString(slug, "u")

	yRegex := regexp.MustCompile(`(ỳ|ý|ỵ|ỷ|ỹ)`)
	slug = yRegex.ReplaceAllString(slug, "y")

	dRegex := regexp.MustCompile(`(đ)`)
	slug = dRegex.ReplaceAllString(slug, "d")

	return slug
}

func SafeUint64ToInt(val uint64) int {
	if val <= math.MaxInt {
		return int(val)
	}
	return 0
}

func SafeInt64ToUint(val int64) uint {
	if val <= math.MaxInt {
		return uint(val)
	}
	return 0
}

func SafeInt64ToInt(val int64) int {
	if val <= math.MaxInt {
		return int(val)
	} else if val >= math.MinInt {
		return int(val)
	}
	return 0
}

func FloorFloatToInt(val float64) int {
	return int(math.Floor(val))
}

func CeilFloatToInt(val float64) int {
	return int(math.Ceil(val))
}

func GenerateOTPCode(length int) string {
	rng := rand.New(rand.NewSource(time.Now().UnixNano()))

	min := int(math.Pow10(length - 1))
	max := int(math.Pow10(length)) - 1

	randomNum := rng.Intn(max-min+1) + min
	return strconv.Itoa(randomNum)
}

func Join(joinCharacter string, values ...string) string {
	var builder strings.Builder
	for index := range len(values) - 1 {
		builder.WriteString(values[index])
	}

	builder.WriteString(values[len(values)-1])
	return builder.String()
}

func StringToFloat64(str string) float64 {
	val, err := strconv.ParseFloat(str, 64)
	if err != nil {
		return 0
	}
	return val
}

func Float64ToString(val float64) string {
	return strconv.FormatFloat(val, 'f', -1, 64)
}

func StringToInt(str string) int {
	val, err := strconv.Atoi(str)
	if err != nil {
		return 0
	}
	return val
}

func IntToString(val int) string {
	return strconv.Itoa(val)
}

func GenerateSignature(data, secret string) string {
	h := hmac.New(sha256.New, []byte(secret))
	h.Write([]byte(data))
	return hex.EncodeToString(h.Sum(nil))
}

func MapToJSONString(m map[string]interface{}) (string, error) {
	jsonBytes, err := json.Marshal(m)
	if err != nil {
		return "", err
	}

	return string(jsonBytes), nil
}
