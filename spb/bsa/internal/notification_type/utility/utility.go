package utility

import (
	"spb/bsa/internal/notification_type/model"
	tb "spb/bsa/pkg/entities"
)

// @author: LoanTT
// @function: MapNotificationTypeEntityToResponse
// @description: Mapping notificationType entity to response
// @param: notificationType tb.NotificationType
// @return: model.NotificationTypeResponse
func MapNotificationTypeEntityToResponse(notificationType *tb.NotificationType) model.NotificationTypeResponse {
	return model.NotificationTypeResponse{
		NotificationTypeID: notificationType.ID,
		Type:               notificationType.Type,
		Template:           notificationType.Template,
		Title:              notificationType.Title,
		Description:        notificationType.Description,
	}
}
