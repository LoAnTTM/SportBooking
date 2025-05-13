import {
  GET_ORDER_BY_CLUB_ID_PATH, GET_ORDERS_BY_USER_ID_PATH, PROCESS_PAYMENT_PATH
} from '@/constants/api';
import { ResponseError } from '@/helpers/error';
import { apiFactory, ApiResponse } from '@/services/http';
import {
  ListOrderResponse, OrderByUnitResponse, PaymentRequest, PaymentResponse
} from '@/services/types';

interface IOrderService {
  getOrdersByUser(
    userId: string
  ): Promise<ApiResponse<ListOrderResponse> | ResponseError>;

  processPayment(
    paymentData: PaymentRequest
  ): Promise<ApiResponse<PaymentResponse> | ResponseError>;

  getOrderByClub(
    clubId: string
  ): Promise<ApiResponse<OrderByUnitResponse[]> | ResponseError>;
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

  public getOrderByClub(
    clubId: string
  ): Promise<ApiResponse<OrderByUnitResponse[]> | ResponseError> {
    return apiFactory(GET_ORDER_BY_CLUB_ID_PATH)
      .addPathParam(':clubId', clubId)
      .get<OrderByUnitResponse[]>();
  }
}

const orderService = new OrderService();
export default orderService;
