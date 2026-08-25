import { useNotificationSSE } from "./hooks/useNotificationSSE";

function NotificationInitializer() {
  useNotificationSSE();
  return null;
}

export default NotificationInitializer;
