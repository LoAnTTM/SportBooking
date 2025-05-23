package utility

import (
	roleUtils "spb/bsa/api/role/utility"
	"spb/bsa/api/user/model"
	tb "spb/bsa/pkg/entities"
	"spb/bsa/pkg/utils"

	"gorm.io/gorm"
)

// @author: LoanTT
// @function: MapUserEntityToResponse
// @description: Mapping user entity to response
// @param: user tb.User
// @return: *model.UserResponse
func MapUserEntityToResponse(user *tb.User) *model.UserResponse {
	return &model.UserResponse{
		UserId:          user.ID,
		Email:           user.Email,
		FullName:        user.FullName,
		Phone:           user.Phone,
		Role:            roleUtils.MapRoleEntityToResponse(&user.Role),
		IsEmailVerified: user.IsEmailVerified,
	}
}

// @author: LoanTT
// @function: MapUsersEntityToResponse
// @description: Map users entity to response
// @param: users []*tb.User
// @return: *model.GetUsersResponse
func MapUsersEntityToResponse(users []*tb.User, total int64, reqBody *model.GetUsersRequest) *model.GetUsersResponse {
	res := new(model.GetUsersResponse)
	for id := range users {
		res.Users = append(res.Users, MapUserEntityToResponse(users[id]))
	}

	res.Total = uint(total)
	res.Pagination = &reqBody.Pagination
	res.Pagination.SetNewPagination(utils.SafeInt64ToInt(total))
	return res
}

// @author: LoanTT
// @function: Check email is verify
// @description: Return db
// @return: *gorm.DB
func EmailIsVerity(db *gorm.DB) *gorm.DB {
	return db.Where("is_email_verified = ?", true)
}

// @author: LoanTT
// @function: Check email is not verify
// @description: Return db
// @return: *gorm.DB
func EmailIsNotVerity(db *gorm.DB) *gorm.DB {
	return db.Where("is_email_verified = ?", false)
}

// @author: LoanTT
// @function: Check user is satisfied
// @description: Return db
// @return: *gorm.DB
func SatisfiedUser(roles []string) func(*gorm.DB) *gorm.DB {
	return func(db *gorm.DB) *gorm.DB {
		return db.Scopes(EmailIsVerity).Where("\"user\".role_id IN ?", roles)
	}
}
