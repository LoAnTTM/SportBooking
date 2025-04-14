package utility

import (
	"spb/bsa/api/notification/model"
	tb "spb/bsa/pkg/entities"
	"spb/bsa/pkg/entities/enum"
	"spb/bsa/pkg/utils"
)

// @author: LoanTT
// @function: MapEntityToResponse
// @description: Mapping notification entity to response
// @param: notification tb.Notification
// @return: model.NotificationResponse
func MapEntityToResponse(notification *tb.Notification) model.NotificationResponse {
	return model.NotificationResponse{
		NotificationID:     notification.ID,
		Status:             string(enum.Progress(notification.Status)),
		Platform:           string(enum.Platform(notification.Platform)),
		Title:              notification.Title,
		Message:            notification.Message,
		Sender:             *notification.SenderID,
		Receiver:           *notification.ReceiverID,
		NotificationTypeID: notification.NotificationTypeID,
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
		Status:             enum.Progress(reqBody.Status),
		NotificationTypeID: notifyType.ID,
		Platform:           enum.Platform(reqBody.Platform),
		Title:              reqBody.Title,
		Message:            reqBody.Message,
		SenderID:           reqBody.SenderID,
		ReceiverID:         reqBody.ReceiverID,
	}
}

func MapEntitiesToResponse(notifications []*tb.Notification, total int64, reqBody *model.GetNotificationsRequest) *model.NotificationsResponse {
	res := new(model.NotificationsResponse)
	res.Notifications = make([]model.NotificationResponse, len(notifications))

	for i, notification := range notifications {
		res.Notifications[i] = MapEntityToResponse(notification)
	}

	// Set pagination
	res.Total = uint(len(res.Notifications))
	res.Pagination = reqBody.Pagination
	res.Pagination.SetNewPagination(utils.SafeInt64ToInt(total))

	return res
}
