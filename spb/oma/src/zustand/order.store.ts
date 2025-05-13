import { create } from 'zustand';

import orderService from '@/services/order.service';
import { OrderByUnitResponse } from '@/services/types';
import { createSelectors } from '@/zustand/selectors';

interface OrderState {
  isLoading: boolean;
  ordersByClub: OrderByUnitResponse[];
}

interface OrderActions {
  getOrderByClub: (clubId: string) => Promise<void>;
}

const initialState: OrderState = {
  isLoading: false,
  ordersByClub: [],
};

const useOrderStoreBase = create<OrderState & OrderActions>((set) => ({
  ...initialState,

  getOrderByClub: async (clubId: string) => {
    set({ isLoading: true });
    const response = await orderService.getOrderByClub(clubId);
    if (response instanceof Error) throw response;

    set({ ordersByClub: response.data, isLoading: false });
  },
}));

export const useOrderStore = createSelectors(useOrderStoreBase);
