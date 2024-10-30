package utility

import (
	"spb/bsa/internal/notification/model"
	tb "spb/bsa/pkg/entities"
	"spb/bsa/pkg/entities/enum"
)

// @author: LoanTT
// @function: MapNotificationEntityToResponse
// @description: Mapping notification entity to response
// @param: notification tb.Notification
// @return: model.NotificationResponse
func MapNotificationEntityToResponse(notification *tb.Notification) model.NotificationResponse {
	return model.NotificationResponse{
		NotificationID: notification.ID,
	}
}

// @author: LoanTT
// @function: mapCreateRequestToEntity
// @description: Mapping create notification request to notification entity
// @param: reqBody *model.CreateNotificationRequest
// @param: notifyType *tb.NotificationType
// @return: *tb.Notification
func MapCreateRequestToEntity(
	reqBody *model.CreateNotificationRequest,
	notifyType *tb.NotificationType,
) *tb.Notification {
	return &tb.Notification{
		Base: tb.Base{
			ID: reqBody.ID,
		},
		Status:             enum.Progress(reqBody.Status),
		NotificationTypeID: notifyType.ID,
		Platform:           enum.Platform(reqBody.Platform),
		Title:              reqBody.Title,
		Message:            reqBody.Message,
		SenderID:           reqBody.SenderID,
		ReceiverID:         reqBody.ReceiverID,
		ReadAt:             reqBody.ReadAt,
	}
}
