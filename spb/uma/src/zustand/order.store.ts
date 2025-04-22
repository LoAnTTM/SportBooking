import { create } from 'zustand';

import orderService from '@/services/order.service';
import { PaymentRequest, PaymentResponse } from '@/services/types';
import { OrderModel } from '@/types/model';
import { createSelectors } from '@/zustand/selectors';

interface OrderState {
  orders: OrderModel[];
  currentOrder: OrderModel | null;
  payment: PaymentResponse | null;
}

interface OrderActions {
  fetchOrdersByUser: (userId: string) => Promise<void>;
  pay: (paymentData: PaymentRequest) => Promise<void>;
  reset: () => void;
}

const initialState: OrderState = {
  orders: [],
  currentOrder: null,
  payment: null,
};

const useOrderStoreBase = create<OrderState & OrderActions>((set) => ({
  ...initialState,

  fetchOrdersByUser: async (userId: string) => {
    const response = await orderService.getOrdersByUser(userId);
    if (response instanceof Error) throw response;

    set({ orders: response.data.orders });
  },

  pay: async (paymentData: PaymentRequest) => {
    const response = await orderService.processPayment(paymentData);
    if (response instanceof Error) throw response;

    set({ payment: response.data });
  },

  reset: () => set({ ...initialState, orders: [] }),
}));

export const useOrderStore = createSelectors(useOrderStoreBase);
