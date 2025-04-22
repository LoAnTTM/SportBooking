import { create } from 'zustand';

import notificationService from '@/services/notification.service';
import { NotificationModel } from '@/types/model';
import { createSelectors } from '@/zustand/selectors';

interface NotificationState {
  notifications: NotificationModel[];
}

interface NotificationActions {
  fetchReceiverNotification: (userId: string) => Promise<void>;
  reset: () => void;
}

const initialState: NotificationState = {
  notifications: [],
};

const useNotificationStoreBase = create<
  NotificationState & NotificationActions
>((set) => ({
  ...initialState,

  fetchReceiverNotification: async (userId: string) => {
    const response = await notificationService.getReceiver(userId);
    if (response instanceof Error) throw response;

    const notifications = response.data.notifications;
    set({ notifications: notifications });
  },
  reset: () => set({ ...initialState, notifications: [] }),
}));

export const useNotificationStore = createSelectors(useNotificationStoreBase);
