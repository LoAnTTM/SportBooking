package utils

import (
	"crypto/rand"
	"fmt"
	"math"
	"path"
	"path/filepath"
	"regexp"
	"runtime"
	"strings"

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
// @description: check (subSet) is subset of (setCheck)
// @param: subSet, setCheck []string
// @return: bool
func IsSubSet(subSet, setCheck []string) bool {
	for subCID := range subSet {
		hasSubItem := false
		for setCID := range setCheck {
			if subSet[subCID] == setCheck[setCID] {
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
// @function: CreateSlug
// @description: create slug
// @param: val string
// @return: string
func CreateSlug(val string) string {
	slug := strings.ToLower(val)
	reg := regexp.MustCompile(`\w+`)
	slug = reg.ReplaceAllString(slug, "-")

	slug = strings.Trim(slug, "-")
	return slug
}

func SafeUint64ToInt(val uint64) int {
	if val <= math.MaxInt {
		return int(val)
	}
	return 0
}
