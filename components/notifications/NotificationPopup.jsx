import React from "react";
import { useRouter } from "next/navigation";
import useGetAllNotificationsManager from "@/app/notifications/controllers/getAllNotificationsController";
import { formatDateAgo } from "@/utils/timeAgo";
import { OpenSingleNotificationManager } from "@/app/notifications/controllers/openSingleNotificationController";
import Loader from "../Loader";

const NotificationPopup = ({ isOpen }) => {
  const router = useRouter();
  const { data: notifications, isLoading: loadingNotifications } =
    useGetAllNotificationsManager({});
  const { openNotification } = OpenSingleNotificationManager();

  if (!isOpen) return null;

  return (
    <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg z-50">
      <div className="p-4 border-b">
        <h3 className="font-medium">Notifications</h3>
      </div>

      {loadingNotifications ? (
        <Loader />
      ) : notifications?.data && notifications.data.length > 0 ? (
        <div className="divide-y">
          {notifications.data.map((activity, index) => (
            <NotificationItem
              key={index}
              title={activity?.title}
              message={activity?.message}
              createdAt={formatDateAgo(activity?.createdAt)}
              isRead={activity?.isRead}
              onClick={() => {
                if (!activity?.isRead) {
                  const details = {
                    notificationId: activity?._id,
                    status: "read",
                  };
                  console.log(details);
                  openNotification(details);
                }
              }}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-8">
          <p className="text-gray-500">You have no notifications</p>
        </div>
      )}

      <button
        onClick={() => router.push("/notifications")}
        className="w-full p-3 text-blue-600 text-sm hover:bg-gray-50 border-t"
      >
        See all notifications
      </button>
    </div>
  );
};

const NotificationItem = ({ title, message, createdAt, isRead, onClick }) => (
  <div
    onClick={onClick}
    className={`p-3 hover:bg-gray-50 text-brandBlack ${
      !isRead ? "bg-blue-50" : ""
    }`}
  >
    <p className="font-medium text-sm">{title}</p>
    <p className="text-sm text-gray-600">{message}</p>
    <span className="text-xs text-gray-500">{createdAt}</span>
  </div>
);

export default NotificationPopup;
