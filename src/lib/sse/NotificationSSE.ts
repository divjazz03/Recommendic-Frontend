import { Notification } from "@/store/NotificationStore";

class NotificationSSE {
  private source: EventSource | null = null;

  connect({
    onNotification,
    accessToken,
  }: {
    onNotification: (n: Notification) => void;

    accessToken: string;
  }) {
    if (this.source) return;

    this.source = new EventSource(
      "/api/v1/sse/notifications?token=" + accessToken,
    );

    this.source.addEventListener("notification", (event) => {
      onNotification(JSON.parse(event.data));
    });
    this.source.onerror = (error) => {
      console.error("SSE error", error);
    };
  }

  disconnect() {
    this.source?.close();
    this.source = null;
  }
}

export const notificationSSE = new NotificationSSE();
