import { create } from 'zustand';

import orderService from '@/services/order.service';
import { PaymentRequest, PaymentResponse } from '@/services/types';
import { OrderModel } from '@/types/model';
import { createSelectors } from '@/zustand/selectors';

interface OrderState {
  orders: OrderModel[];
  paymentResponse: PaymentResponse | null;
  isLoading: boolean;
  lastBooking: PaymentRequest | null;
}

interface OrderActions {
  fetchOrdersByUser: (userId: string) => Promise<void>;
  pay: (paymentData: PaymentRequest) => Promise<void>;
  reset: () => void;
}

const initialState: OrderState = {
  orders: [],
  paymentResponse: null,
  isLoading: false,
  lastBooking: null,
};

const useOrderStoreBase = create<OrderState & OrderActions>((set) => ({
  ...initialState,

  fetchOrdersByUser: async (userId: string) => {
    try {
      set({ isLoading: true });
      const response = await orderService.getOrdersByUser(userId);
      if (response instanceof Error) throw response;

      set({ orders: response.data.orders });
    } finally {
      set({ isLoading: false });
    }
  },

  pay: async (paymentData: PaymentRequest) => {
    try {
      set({ isLoading: true });
      const response = await orderService.processPayment(paymentData);
      if (response instanceof Error) throw response;

      set({ paymentResponse: response.data });
    } finally {
      set({ isLoading: false, lastBooking: paymentData });
    }
  },

  reset: () => set({ ...initialState, orders: [] }),
}));

export const useOrderStore = createSelectors(useOrderStoreBase);
