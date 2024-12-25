import React from "react";
import { Bell, User, Calendar, Gift } from "lucide-react";
import BaseDashboardNavigation from "@/components/BaseDashboardNavigation";

const NotificationItem = ({ icon: Icon, title, message, time, isUnread }) => (
  <div className={`p-4 border-b ${isUnread ? "bg-blue-50" : ""}`}>
    <div className="flex items-start gap-3">
      <div className="p-2 bg-gray-100 rounded-full">
        <Icon size={16} className="text-gray-600" />
      </div>
      <div className="flex-1">
        <h3 className="text-sm font-medium text-gray-900">{title}</h3>
        <p className="text-sm text-gray-600 mt-1">{message}</p>
        <span className="text-xs text-gray-500 mt-2 block">{time}</span>
      </div>
    </div>
  </div>
);

const NotificationsPage = () => {
  const notifications = [
    {
      icon: User,
      title: "New Guest RSVP",
      message: "John Doe has confirmed attendance to your event",
      time: "2 hours ago",
      isUnread: true,
    },
    {
      icon: Calendar,
      title: "Event Reminder",
      message: "Your event 'Wedding Ceremony' is happening tomorrow",
      time: "5 hours ago",
      isUnread: true,
    },
    {
      icon: Gift,
      title: "Gift Registry Update",
      message: "A new gift has been purchased from your registry",
      time: "1 day ago",
      isUnread: false,
    },
  ];

  return (
    <BaseDashboardNavigation title="Notifications">
      <div className="w-full max-w-[70%]">
        <div className="bg-white rounded-lg shadow divide-y">
          {notifications.map((notification, index) => (
            <NotificationItem key={index} {...notification} />
          ))}
        </div>
      </div>
    </BaseDashboardNavigation>
  );
};

export default NotificationsPage;
