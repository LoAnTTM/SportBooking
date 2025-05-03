import { GET_ORDERS_BY_USER_ID_PATH, PROCESS_PAYMENT_PATH } from '@/constants/api';
import { ResponseError } from '@/helpers/error';
import { apiFactory, ApiResponse } from '@/services/http';
import { ListOrderResponse, PaymentRequest, PaymentResponse } from '@/services/types';

interface IOrderService {
  getOrdersByUser(
    userId: string
  ): Promise<ApiResponse<ListOrderResponse> | ResponseError>;
  processPayment(
    paymentData: PaymentRequest
  ): Promise<ApiResponse<PaymentResponse> | ResponseError>;
}

class OrderService implements IOrderService {
  public getOrdersByUser(
    id: string
  ): Promise<ApiResponse<ListOrderResponse> | ResponseError> {
    return apiFactory(GET_ORDERS_BY_USER_ID_PATH)
      .addPathParam(':userId', id)
      .get<ListOrderResponse>();
  }

  public processPayment(
    paymentData: PaymentRequest
  ): Promise<ApiResponse<PaymentResponse> | ResponseError> {
    return apiFactory(PROCESS_PAYMENT_PATH).post<PaymentResponse>(paymentData);
  }
}

const orderService = new OrderService();
export default orderService;
