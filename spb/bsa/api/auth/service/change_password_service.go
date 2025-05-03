package service

import (
	"spb/bsa/api/auth/model"
	tb "spb/bsa/pkg/entities"
	"spb/bsa/pkg/msg"
	"spb/bsa/pkg/utils"
)

// @author: LoanTT
// @function: ChangePassword
// @description: Service for changing user password
// @param: userID string, reqBody *model.ChangePasswordRequest
// @return: error
func (s *Service) ChangePassword(userID string, reqBody *model.ChangePasswordRequest) (err error) {
	user := new(tb.User)

	// Get user with either verified email or authentication providers
	err = s.db.Model(&tb.User{}).
		Where("\"user\".id = ?", userID).
		Where("\"user\".is_email_verified = ?", true).
		First(user).Error
	if err != nil {
		return err
	}

	// Verify current password
	if ok := utils.BcryptCheck(reqBody.CurrentPassword, user.Password); !ok {
		return msg.ErrIncorrectPassword
	}

	// Update with new password
	user.Password = utils.BcryptHash(reqBody.NewPassword)
	if err = s.db.Save(user).Error; err != nil {
		return err
	}

	return nil
}
