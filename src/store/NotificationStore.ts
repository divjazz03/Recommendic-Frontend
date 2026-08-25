import { create } from "zustand";

export interface Notification {
  id: string;
  message: string;
}

interface NotificationStore {
  notifications: Notification[];
  addNotification: (n: Notification) => void;
  addNotifications: (n: Notification[]) => void;
  clearNotifications: () => void;
  unreadCount: number;
}

export const useNotificationStore = create<NotificationStore>((set) => ({
  notifications: [],
  addNotification: (notification) =>
    set((state) => ({
      notifications: [notification, ...state.notifications],
    })),
  clearNotifications: () =>
    set((state) => ({
      notifications: [],
      unreadCount: 0,
    })),
  unreadCount: 0,
  addNotifications: (notifications) =>
    set((state) => ({
      notifications: [...notifications, ...state.notifications],
      unreadCount: state.unreadCount + notifications.length,
    })),
}));
