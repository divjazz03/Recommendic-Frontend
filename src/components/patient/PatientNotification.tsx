import {
  Activity,
  Bell,
  Calendar,
  CheckCircle,
  Clock,
  FileText,
  Pill,
  X,
} from "lucide-react";
import React, { useState } from "react";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "../ui/empty";

type PatientNotificationType =
  | "appointment"
  | "medication"
  | "test_result"
  | "general";

interface PatientNotification {
  id: string;
  type: PatientNotificationType;
  title: string;
  message: string;
  time: string;
  isRead: boolean;
  priority: "high" | "medium" | "low";
}

const getIcon = (type: PatientNotificationType) => {
  const iconClass = "w-5 h-5";
  switch (type) {
    case "appointment":
      return <Calendar className={iconClass} />;
    case "medication":
      return <Pill className={iconClass} />;
    case "test_result":
      return <FileText className={iconClass} />;
    default:
      return <Bell className={iconClass} />;
  }
};

const getIconBgColor = (type: PatientNotificationType, isRead: boolean) => {
  const opacity = isRead ? "bg-opacity-50" : "bg-opacity-100";
  switch (type) {
    case "appointment":
      return `bg-blue-100 ${opacity}`;
    case "medication":
      return `bg-green-100 ${opacity}`;
    case "test_result":
      return `bg-purple-100 ${opacity}`;
    default:
      return `bg-gray-100 ${opacity}`;
  }
};
const getIconColor = (type: PatientNotificationType) => {
  switch (type) {
    case "appointment":
      return "text-blue-600";
    case "medication":
      return "text-green-600";
    case "test_result":
      return "text-purple-600";
    default:
      return "text-gray-600";
  }
};

const exampleNotifications: PatientNotification[] = [
  {
    id: "1",
    type: "appointment",
    title: "Upcoming Appointment",
    message: "Cardiology checkup with Dr. Sarah Johnson tomorrow at 10:00 AM",
    time: "2 hours ago",
    isRead: false,
    priority: "high",
  },
  {
    id: "2",
    type: "medication",
    title: "Medication Reminder",
    message: "Time to take your evening dose of Lisinopril 10mg",
    time: "3 hours ago",
    isRead: false,
    priority: "high",
  },
  {
    id: "3",
    type: "test_result",
    title: "Lab Results Available",
    message: "Your blood work results from last week are now available",
    time: "5 hours ago",
    isRead: false,
    priority: "medium",
  },
  {
    id: "5",
    type: "general",
    title: "Prescription Ready",
    message: "Your prescription is ready for pickup at Walgreens on Main St",
    time: "1 day ago",
    isRead: true,
    priority: "medium",
  },
  {
    id: "6",
    type: "appointment",
    title: "Appointment Confirmed",
    message: "Your dental cleaning on Dec 15 at 2:00 PM has been confirmed",
    time: "2 days ago",
    isRead: true,
    priority: "low",
  },
];

const PatientNotification = () => {
  const [notifications, setNotifications] = useState<PatientNotification[]>(
    exampleNotifications || []
  );
  const [filter, setFilter] = useState<"all" | "unread">("all");

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

  const filteredNotifications =
    filter === "unread"
      ? notifications.filter((n) => !n.isRead)
      : notifications;

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <div className="h-full overflow-y-auto">
      <div className="flex flex-col h-full max-w-4xl mx-auto">
        {/* Header */}
        <div className=" p-6 mb-6 bg-white sticky top-0 z-50 rounded-b-lg">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                  Notifications
                </h1>
                <p className="text-sm text-gray-500">
                  {unreadCount} unread messages
                </p>
              </div>
            </div>
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm font-medium"
              >
                <CheckCircle className="w-4 h-4" />
                Mark all read
              </button>
            )}
          </div>

          {/* Filter Tabs */}
          <div className="flex gap-2 border-b border-gray-200">
            <button
              onClick={() => setFilter("all")}
              className={`px-4 py-2 font-medium text-sm transition-colors ${
                filter === "all"
                  ? "text-indigo-600 border-b-2 border-indigo-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              All ({notifications.length})
            </button>
            <button
              onClick={() => setFilter("unread")}
              className={`px-4 py-2 font-medium text-sm transition-colors ${
                filter === "unread"
                  ? "text-indigo-600 border-b-2 border-indigo-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Unread ({unreadCount})
            </button>
          </div>
        </div>

        {/* Notifications List */}
        <div className="flex flex-col flex-1 gap-6 py-2 px-6 md:px-8">
          {filteredNotifications.length === 0 ? (
            <div className="h-full flex justify-center items-center ">
              <Empty>
                <EmptyHeader>
                  <EmptyMedia>
                    <Bell />
                  </EmptyMedia>
                  <EmptyTitle>No Notifications</EmptyTitle>
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
                      <h3
                        className={`font-semibold ${
                          notification.isRead
                            ? "text-gray-700"
                            : "text-gray-900"
                        }`}
                      >
                        {notification.title}
                      </h3>
                      <button
                        onClick={() => deleteNotification(notification.id)}
                        className="text-gray-400 hover:text-red-500 transition-colors p-1"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>

                    <p
                      className={`text-sm mb-3 ${
                        notification.isRead ? "text-gray-500" : "text-gray-700"
                      }`}
                    >
                      {notification.message}
                    </p>

                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1 text-xs text-gray-500">
                        <Clock className="w-3 h-3" />
                        {notification.time}
                      </div>

                      {notification.priority === "high" && (
                        <span className="px-2 py-1 bg-red-100 text-red-700 text-xs font-medium rounded">
                          Urgent
                        </span>
                      )}

                      {!notification.isRead && (
                        <button
                          onClick={() => markAsRead(notification.id)}
                          className="ml-auto text-xs text-indigo-600 hover:text-indigo-700 font-medium"
                        >
                          Mark as read
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default PatientNotification;
