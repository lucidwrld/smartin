import React from "react";
import { useRouter } from "next/navigation";

const NotificationPopup = ({ isOpen }) => {
  const router = useRouter();

  if (!isOpen) return null;

  return (
    <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg z-50">
      <div className="p-4 border-b">
        <h3 className="font-medium">Notifications</h3>
      </div>

      <div className="divide-y">
        <NotificationItem
          title="New Guest RSVP"
          message="John Doe has confirmed attendance"
          time="2h ago"
          isUnread={true}
        />
        <NotificationItem
          title="Event Reminder"
          message="Wedding Ceremony tomorrow"
          time="5h ago"
          isUnread={true}
        />
        <NotificationItem
          title="Gift Registry Update"
          message="New gift purchased"
          time="1d ago"
          isUnread={false}
        />
      </div>

      <button
        onClick={() => router.push("/notifications")}
        className="w-full p-3 text-blue-600 text-sm hover:bg-gray-50 border-t"
      >
        See all notifications
      </button>
    </div>
  );
};

const NotificationItem = ({ title, message, time, isUnread }) => (
  <div
    className={`p-3 hover:bg-gray-50 text-brandBlack ${
      isUnread ? "bg-blue-50" : ""
    }`}
  >
    <p className="font-medium text-sm">{title}</p>
    <p className="text-sm text-gray-600">{message}</p>
    <span className="text-xs text-gray-500">{time}</span>
  </div>
);

export default NotificationPopup;
