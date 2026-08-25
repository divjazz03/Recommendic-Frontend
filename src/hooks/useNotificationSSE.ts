import { notificationSSE } from "@/lib/sse/NotificationSSE";
import { useNotificationStore } from "@/store/NotificationStore";
import { useTokenStore } from "@/store/TokenStore";
import { useEffect } from "react";

export function useNotificationSSE() {
  const addNotification = useNotificationStore(
    (state) => state.addNotification,
  );

  const { accessToken } = useTokenStore();

  useEffect(() => {
    if (!accessToken) return;
    notificationSSE.connect({ onNotification: addNotification, accessToken });

    return () => notificationSSE.disconnect();
  }, [addNotification, accessToken]);
}
