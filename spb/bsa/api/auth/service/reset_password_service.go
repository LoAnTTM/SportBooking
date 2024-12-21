package service

import (
	"spb/bsa/api/auth/model"
	notifyServ "spb/bsa/api/notification"
	"spb/bsa/pkg/cache"
	tb "spb/bsa/pkg/entities"
	"spb/bsa/pkg/entities/enum"
	"spb/bsa/pkg/msg"
	"spb/bsa/pkg/utils"
)

// @author: LoanTT
// @function: ResetPassword
// @description: Service for reset password
// @param: reqBody *model.ResetPasswordRequest
// @return: error
func (s *Service) ResetPassword(reqBody *model.ResetPasswordRequest) error {
	if ok := cache.VerifyToken.CheckVerifyToken(reqBody.Token); !ok {
		return msg.ErrTokenExpired
	}

	user := new(tb.User)
	err := s.db.Where("email = ?", reqBody.Email).First(user).Error
	if err != nil {
		return err
	}

	user.Password = utils.BcryptHash(reqBody.Password)
	if err := s.db.Save(user).Error; err != nil {
		return err
	}

	// Update notification status
	err = notifyServ.NotificationService.UpdateStatus(reqBody.Token, enum.Progress(enum.SUCCESS))
	if err != nil {
		return err
	}

	cache.VerifyToken.DelVerifyToken(reqBody.Token)
	return nil
}
