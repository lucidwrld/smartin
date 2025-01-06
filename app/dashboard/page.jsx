"use client";

import React from "react";
import {
  Calendar,
  Plus,
  Gift,
  Users,
  Send,
  UserCheck,
  Percent,
  Clock,
  ChevronRight,
} from "lucide-react";
import Link from "next/link";
import BaseDashboardNavigation from "@/components/BaseDashboardNavigation";
import useGetUserDetailsManager from "../profile-settings/controllers/get_UserDetails_controller";
import DiscountModal from "@/components/DiscountModal";
import useGetAllUserInvitedEventsManager from "../events/controllers/getAllUserInvitedEventsController";
import useGetAllNotificationsManager from "../notifications/controllers/getAllNotificationsController";
import { formatDateAgo } from "@/utils/timeAgo";
import { formatDateToLongString } from "@/utils/formatDateToLongString";
import { OpenSingleNotificationManager } from "../notifications/controllers/openSingleNotificationController";

const StatCard = ({ icon: Icon, label, value, trend }) => (
  <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow text-brandBlack">
    <div className="flex justify-between items-start">
      <div>
        <p className="text-gray-600 text-sm">{label}</p>
        <p className="text-2xl font-semibold mt-1">{value}</p>
        {trend && (
          <p
            className={`text-xs mt-1 ${
              trend > 0 ? "text-green-500" : "text-red-500"
            }`}
          >
            {trend > 0 ? "↑" : "↓"} {Math.abs(trend)}% from last month
          </p>
        )}
      </div>
      <div className="p-2 bg-backgroundPurple/10 rounded-lg">
        <Icon className="text-brandPurple" size={20} />
      </div>
    </div>
  </div>
);

const ActivityItem = ({ title, message, createdAt, isRead, onClick }) => (
  <div
    onClick={onClick}
    className={`p-4 border-b hover:bg-gray-50 transition-colors text-brandBlack ${
      !isRead ? "bg-blue-50" : ""
    }`}
  >
    <div className="flex items-start gap-3">
      {/* <div className="p-2 bg-backgroundPurple/10 rounded-lg">
        <Icon size={16} className="text-brandPurple" />
      </div> */}
      <div className="flex-1">
        <div className="flex justify-between items-start">
          <p className="font-medium text-sm">{title}</p>
          <span className="text-xs text-gray-500">
            {formatDateAgo(createdAt)}
          </span>
        </div>
        <p className="text-sm text-gray-600 mt-1">{message}</p>
      </div>
    </div>
  </div>
);

const UpcomingEvent = ({ name, date, no_of_invitees }) => (
  <div className="p-4 flex items-center justify-between hover:bg-gray-50 transition-colors text-brandBlack">
    <div>
      <p className="font-medium text-sm">{name}</p>
      <div className="flex items-center gap-2 mt-1">
        <Clock size={14} className="text-gray-400" />
        <span className="text-sm text-gray-600">
          {formatDateToLongString(date)}
        </span>
        <span className="text-gray-400">•</span>
        <Users size={14} className="text-gray-400" />
        <span className="text-sm text-gray-600">{no_of_invitees} guests</span>
      </div>
    </div>
    <ChevronRight size={16} className="text-gray-400" />
  </div>
);

const PromoCard = () => (
  <div className="bg-gradient-to-br from-brandPurple to-backgroundPurple p-6 rounded-xl text-white">
    <div className="p-2 bg-white/10 rounded-lg w-fit">
      <Percent className="text-white" size={24} />
    </div>
    <h3 className="text-lg font-semibold mt-4">Discount Opportunities</h3>
    <p className="text-sm opacity-90 mt-2">
      Send more invites to unlock amazing discounts on your total spend
    </p>
    {/* <button className="mt-4 bg-white text-brandPurple px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors">
      Learn More
    </button> */}
    <DiscountModal />
  </div>
);

const Dashboard = () => {
  const stats = [
    { icon: Calendar, label: "Active Events", value: "3", trend: 12.5 },
    { icon: Send, label: "Invitations Sent", value: "145", trend: -5.2 },
    { icon: UserCheck, label: "Responses", value: "89", trend: 8.7 },
    { icon: Gift, label: "Gift Registry Items", value: "24", trend: 15.3 },
  ];

  const upcomingEvents = [
    { title: "Wedding Ceremony", date: "Dec 15, 2024", guestCount: 150 },
    { title: "Birthday Party", date: "Dec 20, 2024", guestCount: 45 },
    { title: "Christmas Dinner", date: "Dec 25, 2024", guestCount: 25 },
  ];

  const { data: userDetails } = useGetUserDetailsManager();
  const { data: userInvites, isLoading: loadingInvites } =
    useGetAllUserInvitedEventsManager({
      status: "upcoming",
      enabled: true,
      page: 1,
    });
  const { data: notifications, isLoading: loadingNotifications } =
    useGetAllNotificationsManager({});
  const { openNotification } = OpenSingleNotificationManager();

  return (
    <BaseDashboardNavigation title="Dashboard">
      <div className="p-6 space-y-6 bg-gray-50 min-h-screen text-brandBlack">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">
              Welcome back, {userDetails?.data?.user?.fullname}!
            </h1>
            <p className="text-gray-600 mt-1">
              Here's what's happening with your events.
            </p>
          </div>
          <Link href="/events/create-event">
            <button className="bg-brandPurple hover:bg-backgroundPurple text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors">
              <Plus size={20} />
              Create New Event
            </button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {stats.map((stat, index) => (
            <StatCard key={index} {...stat} />
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="col-span-2 space-y-6">
            <div className="bg-white rounded-xl shadow-sm">
              <div className="p-4 border-b">
                <h2 className="font-semibold">Recent Activity</h2>
              </div>
              {notifications?.data && notifications.data.length > 0 ? (
                <div className="divide-y">
                  {notifications.data.map((activity, index) => (
                    <ActivityItem
                      key={index}
                      {...activity}
                      onClick={() => {
                        if (!activity?.isRead) {
                          const details = {
                            notificationId: activity?._id,
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

            <div className="bg-white rounded-xl shadow-sm">
              <div className="p-4 border-b flex justify-between items-center">
                <h2 className="font-semibold">Upcoming Events</h2>
                <Link
                  href="/events"
                  className="text-brandPurple text-sm hover:underline"
                >
                  View all
                </Link>
              </div>
              {userInvites?.data && userInvites.data.length > 0 ? (
                <div className="divide-y">
                  {userInvites.data.map((event, index) => (
                    <UpcomingEvent key={index} {...event} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500">You have no upcoming events</p>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-6">
            <PromoCard />
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <h3 className="font-semibold mb-4">Quick Tips</h3>
              <div className="space-y-3">
                <p className="text-sm text-gray-600">
                  • Always check your analytics to track invite deliveries and
                  guest responses
                </p>
                <p className="text-sm text-gray-600">
                  • Set up your access management section for organized event
                  entry
                </p>
                <p className="text-sm text-gray-600">
                  • Enable table management to provide guests with clear seating
                  locations
                </p>
                <p className="text-sm text-gray-600">
                  • Use the automated reminder system for guests who haven't
                  responded
                </p>
                <p className="text-sm text-gray-600">
                  • Keep your guest information updated for seamless
                  communication
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </BaseDashboardNavigation>
  );
};

export default Dashboard;
