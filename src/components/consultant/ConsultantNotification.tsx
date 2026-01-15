import { Button } from "@/components/ui/button";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import {
  Bell,
  Calendar,
  CheckCircle,
  ClipboardList,
  Clock,
  FileText,
  X,
} from "lucide-react";
import React, { useState } from "react";

type ConsultantNotificationType = "lab_result" | "appointment" | "prescription";

interface ConsultantNotification {
  id: string;
  type: ConsultantNotificationType;
  title: string;
  message: string;
  patientName: string;
  patientId: string;
  time: string;
  isRead: boolean;
}

const getIcon = (type: ConsultantNotificationType) => {
  const iconClass = "w-5 h-5";
  switch (type) {
    case "lab_result":
      return <FileText className={iconClass} />;
    case "appointment":
      return <Calendar className={iconClass} />;
    case "prescription":
      return <ClipboardList className={iconClass} />;
    default:
      return <Bell className={iconClass} />;
  }
};

const getIconBgColor = (type: ConsultantNotificationType, isRead: boolean) => {
  const opacity = isRead ? "bg-opacity-50" : "bg-opacity-100";

  switch (type) {
    case "lab_result":
      return `bg-purple-100 ${opacity}`;
    case "appointment":
      return `bg-cyan-100 ${opacity}`;
    case "prescription":
      return `bg-green-100 ${opacity}`;
    default:
      return `bg-gray-100 ${opacity}`;
  }
};

const getIconColor = (type: ConsultantNotificationType) => {
  switch (type) {
    case "lab_result":
      return "text-purple-600";
    case "appointment":
      return "text-cyan-600";
    case "prescription":
      return "text-green-600";
    default:
      return "text-gray-600";
  }
};

const exampleNotifications: ConsultantNotification[] = [
  {
    id: "2",
    type: "lab_result",
    title: "Abnormal Lab Results",
    message: "HbA1c: 9.2% - Elevated glucose levels detected",
    patientName: "Maria Rodriguez",
    patientId: "PT-3921",
    time: "15 min ago",
    isRead: false,
  },

  {
    id: "4",
    type: "appointment",
    title: "Appointment Rescheduled",
    message: "Follow-up moved from Dec 12 to Dec 15 at 2:30 PM",
    patientName: "Sarah Thompson",
    patientId: "PT-2103",
    time: "2 hours ago",
    isRead: false,
  },
  {
    id: "6",
    type: "prescription",
    title: "Prescription Approval Required",
    message: "Request for Warfarin dosage adjustment pending your review",
    patientName: "Emily Davis",
    patientId: "PT-1982",
    time: "4 hours ago",
    isRead: true,
  },
  {
    id: "8",
    type: "lab_result",
    title: "Lab Results Available",
    message: "Complete blood count and metabolic panel ready for review",
    patientName: "Lisa Anderson",
    patientId: "PT-3452",
    time: "1 day ago",
    isRead: true,
  },
];

const ConsultantNotification = () => {
  const [filter, setFilter] = useState<"all" | "unread" | "critical">("all");

  const [notifications, setNotifications] =
    useState<ConsultantNotification[]>(exampleNotifications);

  const markAsRead = (id: string) => {
    setNotifications(
      notifications.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    );
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, isRead: true })));
  };

  const deleteNotification = (id: string) => {
    setNotifications(notifications.filter((n) => n.id !== id));
  };

  const filteredNotifications = notifications.filter((n) => {
    if (filter === "unread") return !n.isRead;
    return true;
  });

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <main className="h-full overflow-y-auto">
      <div className="max-w-5xl mx-auto flex flex-col h-full">
        {/* Header */}
        <header className="flex flex-col gap-6 p-6 bg-white sticky top-0 z-40 rounded-b-lg">
          <div className="flex items-center justify-between ">
            <div className="flex items-center gap-3">
              <div className="bg-main-light p-3 rounded-xl">
                <Bell className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                  Consultant Dashboard
                </h1>
                <p className="text-xs sm:text-sm text-gray-500">
                  {unreadCount} unread
                </p>
              </div>
            </div>
            {unreadCount > 0 && (
              <Button onClick={markAllAsRead}>
                <CheckCircle className="w-4 h-4 hidden sm:inline" />
                Mark all read
              </Button>
            )}
          </div>

          {/* Filter Tabs */}
          <div className="flex gap-2 border-b border-gray-200">
            <button
              onClick={() => setFilter("all")}
              className={`px-4 py-2 font-medium text-xs sm:text-sm transition-colors ${
                filter === "all"
                  ? "text-blue-600 border-b-2 border-blue-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              All ({notifications.length})
            </button>
            <button
              onClick={() => setFilter("unread")}
              className={`px-4 py-2 font-medium text-xs sm:text-sm transition-colors ${
                filter === "unread"
                  ? "text-blue-600 border-b-2 border-blue-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Unread ({unreadCount})
            </button>
          </div>
        </header>

        {/* Notifications List */}
        <div className=" flex flex-col flex-1 gap-6 py-2 px-6 md:px-8">
          {filteredNotifications.length === 0 ? (
            <div className="h-full flex justify-center items-center ">
              <Empty>
                <EmptyHeader>
                  <EmptyMedia>
                    <Bell className="text-main-light" size={48}  />
                  </EmptyMedia>
                  <EmptyTitle className="text-gray-700">No Notifications</EmptyTitle>
                  <EmptyDescription>You're all caught up!</EmptyDescription>
                </EmptyHeader>
              </Empty>
            </div>
          ) : (
            filteredNotifications.map((notification) => (
              <div
                key={notification.id}
                className={`bg-white rounded-xl shadow-md hover:shadow-lg transition-all p-5 ${
                  !notification.isRead ? "border-l-4 border-indigo-500" : ""
                }`}
              >
                <div className="flex gap-4">
                  <div
                    className={`${getIconBgColor(
                      notification.type,
                      notification.isRead
                    )} p-3 rounded-xl h-fit ${getIconColor(notification.type)}`}
                  >
                    {getIcon(notification.type)}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-3 mb-1">
                      <div className="flex-1">
                        <h3
                          className={`font-semibold ${
                            notification.isRead
                              ? "text-gray-700"
                              : "text-gray-900"
                          }`}
                        >
                          {notification.title}
                        </h3>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-sm font-medium text-blue-600">
                            {notification.patientName}
                          </span>
                          <span className="text-xs text-gray-400">•</span>
                          <span className="text-xs text-gray-500">
                            {notification.patientId}
                          </span>
                        </div>
                      </div>
                      <button
                        onClick={() => deleteNotification(notification.id)}
                        className="text-gray-400 hover:text-red-500 transition-colors p-1"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>

                    <p
                      className={`text-sm mb-3 mt-2 ${
                        notification.isRead ? "text-gray-500" : "text-gray-700"
                      }`}
                    >
                      {notification.message}
                    </p>

                    <div className="flex items-center gap-4 flex-wrap">
                      <div className="flex items-center gap-1 text-xs text-gray-500">
                        <Clock className="w-3 h-3" />
                        {notification.time}
                      </div>

                      <div className="flex gap-2 ml-auto">
                        {!notification.isRead && (
                          <button
                            onClick={() => markAsRead(notification.id)}
                            className="px-3 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded hover:bg-gray-200 transition-colors"
                          >
                            Mark read
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </main>
  );
};

export default ConsultantNotification;
