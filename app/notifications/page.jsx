"use client";
import React from "react";
import { Bell, User, Calendar, Gift, Loader } from "lucide-react";
import BaseDashboardNavigation from "@/components/BaseDashboardNavigation";
import useGetAllNotificationsManager from "./controllers/getAllNotificationsController";
import { OpenSingleNotificationManager } from "./controllers/openSingleNotificationController";
import { formatDateAgo } from "@/utils/timeAgo";
import CustomButton from "@/components/Button";
import { OpenAllNotificationsManager } from "./controllers/openAllNotificationsController";

const NotificationItem = ({
  // icon: Icon,
  title,
  message,
  createdAt,
  isRead,
  onClick,
}) => (
  <div
    onClick={onClick}
    className={`p-4 border-b ${!isRead ? "bg-blue-50" : ""}`}
  >
    <div className="flex items-start gap-3">
      {/* <div className="p-2 bg-gray-100 rounded-full">
        <Icon size={16} className="text-gray-600" />
      </div> */}
      <div className="flex-1">
        <h3 className="text-sm font-medium text-gray-900">{title}</h3>
        <p className="text-sm text-gray-600 mt-1">{message}</p>
        <span className="text-xs text-gray-500 mt-2 block">
          {formatDateAgo(createdAt)}
        </span>
      </div>
    </div>
  </div>
);

const NotificationsPage = () => {
  const { data: notifications, isLoading: loadingNotifications } =
    useGetAllNotificationsManager({});
  const { openNotification } = OpenSingleNotificationManager();
  const { openAll, isLoading: loadingAll } = OpenAllNotificationsManager();

  return (
    <BaseDashboardNavigation title="Notifications">
      {notifications?.data && notifications?.data?.length > 0 && (
        <div className="w-full items-center justify-end flex mb-5 md:mb-0">
          <CustomButton
            buttonText={"Mark All as Read"}
            onClick={() => openAll()}
            isLoading={loadingAll}
            radius={"rounded-full"}
          />
        </div>
      )}
      <div className="md:w-full max-w-[95%] mx-auto md:max-w-[70%]">
        {loadingNotifications ? (
          <Loader />
        ) : notifications?.data && notifications.data.length > 0 ? (
          <div className="bg-white rounded-lg shadow divide-y">
            {notifications?.data.map((notification, index) => (
              <NotificationItem
                key={index}
                {...notification}
                onClick={() => {
                  if (!notification?.isRead) {
                    const details = {
                      notificationId: notification?._id,
                      status: "read",
                    };
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
      </div>
    </BaseDashboardNavigation>
  );
};

export default NotificationsPage;
