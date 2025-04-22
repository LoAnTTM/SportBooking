import { RECEIVER_NOTIFICATIONS_PATH } from '@/constants';
import { ResponseError } from '@/helpers/error';
import { apiFactory, ApiResponse } from '@/services/http';
import { GetNotificationResponse } from '@/services/types';

interface INotificationService {
  getReceiver: (
    userId: string
  ) => Promise<ApiResponse<GetNotificationResponse> | ResponseError>;
}

class NotificationService implements INotificationService {
  getReceiver(
    userId: string
  ): Promise<ApiResponse<GetNotificationResponse> | ResponseError> {
    return apiFactory(RECEIVER_NOTIFICATIONS_PATH)
      .addPathParam(':id', userId)
      .get<GetNotificationResponse>();
  }
}

const notificationService = new NotificationService();
export default notificationService;
