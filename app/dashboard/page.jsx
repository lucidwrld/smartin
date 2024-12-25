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

const ActivityItem = ({ icon: Icon, title, description, time }) => (
  <div className="p-4 border-b hover:bg-gray-50 transition-colors text-brandBlack">
    <div className="flex items-start gap-3">
      <div className="p-2 bg-backgroundPurple/10 rounded-lg">
        <Icon size={16} className="text-brandPurple" />
      </div>
      <div className="flex-1">
        <div className="flex justify-between items-start">
          <p className="font-medium text-sm">{title}</p>
          <span className="text-xs text-gray-500">{time}</span>
        </div>
        <p className="text-sm text-gray-600 mt-1">{description}</p>
      </div>
    </div>
  </div>
);

const UpcomingEvent = ({ title, date, guestCount }) => (
  <div className="p-4 flex items-center justify-between hover:bg-gray-50 transition-colors text-brandBlack">
    <div>
      <p className="font-medium text-sm">{title}</p>
      <div className="flex items-center gap-2 mt-1">
        <Clock size={14} className="text-gray-400" />
        <span className="text-sm text-gray-600">{date}</span>
        <span className="text-gray-400">•</span>
        <Users size={14} className="text-gray-400" />
        <span className="text-sm text-gray-600">{guestCount} guests</span>
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
    <h3 className="text-lg font-semibold mt-4">Special Offer</h3>
    <p className="text-sm opacity-90 mt-2">
      Send more than 100 invites and get 20% off on your next event
    </p>
    <button className="mt-4 bg-white text-brandPurple px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors">
      Learn More
    </button>
  </div>
);

const Dashboard = () => {
  const stats = [
    { icon: Calendar, label: "Active Events", value: "3", trend: 12.5 },
    { icon: Send, label: "Invitations Sent", value: "145", trend: -5.2 },
    { icon: UserCheck, label: "Responses", value: "89", trend: 8.7 },
    { icon: Gift, label: "Gift Registry Items", value: "24", trend: 15.3 },
  ];

  const activities = [
    {
      icon: UserCheck,
      title: "New RSVP",
      description:
        "John & Sarah confirmed their attendance to Wedding Ceremony",
      time: "2h ago",
    },
    {
      icon: Gift,
      title: "Gift Registry Update",
      description:
        'Someone purchased "Cuisinart Stand Mixer" from your registry',
      time: "5h ago",
    },
    {
      icon: Send,
      title: "Invitations Sent",
      description: "Successfully sent 50 new invitations for Birthday Party",
      time: "1d ago",
    },
  ];

  const upcomingEvents = [
    { title: "Wedding Ceremony", date: "Dec 15, 2024", guestCount: 150 },
    { title: "Birthday Party", date: "Dec 20, 2024", guestCount: 45 },
    { title: "Christmas Dinner", date: "Dec 25, 2024", guestCount: 25 },
  ];

  const { data: userDetails } = useGetUserDetailsManager();

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
              <div className="divide-y">
                {activities.map((activity, index) => (
                  <ActivityItem key={index} {...activity} />
                ))}
              </div>
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
              <div className="divide-y">
                {upcomingEvents.map((event, index) => (
                  <UpcomingEvent key={index} {...event} />
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <PromoCard />
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <h3 className="font-semibold mb-4">Quick Tips</h3>
              <div className="space-y-3">
                <p className="text-sm text-gray-600">
                  • Add a gift registry to increase guest engagement
                </p>
                <p className="text-sm text-gray-600">
                  • Send reminders to guests who haven't responded
                </p>
                <p className="text-sm text-gray-600">
                  • Complete your event details for better organization
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
