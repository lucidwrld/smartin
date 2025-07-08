"use client";

import React from "react";
import {
  Users,
  Calendar,
  DollarSign,
  Activity,
  AlertCircle,
  Settings,
  ChevronRight,
  TrendingUp,
} from "lucide-react";
import Link from "next/link";
import BaseDashboardNavigation from "@/components/BaseDashboardNavigation";
import useGetUserAnalyticsManager from "@/app/events/controllers/getUserAnalyticsController";

const StatCard = ({ icon: Icon, label, value, trend }) => (
  <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
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
            {trend > 0 ? "↑" : "↓"} {Math.abs(trend)}% vs last month
          </p>
        )}
      </div>
      <div className="p-2 bg-blue-50 rounded-lg">
        <Icon className="text-blue-600" size={20} />
      </div>
    </div>
  </div>
);

const AlertCard = ({ title, description, time, priority }) => (
  <div className="p-4 border-b hover:bg-gray-50 transition-colors">
    <div className="flex items-start gap-3">
      <div
        className={`p-2 rounded-lg ${
          priority === "high" ? "bg-red-100" : "bg-yellow-100"
        }`}
      >
        <AlertCircle
          size={16}
          className={priority === "high" ? "text-red-600" : "text-yellow-600"}
        />
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

const RecentUser = ({ name, email, joinDate, eventCount }) => (
  <div className="p-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
    <div>
      <p className="font-medium text-sm">{name}</p>
      <p className="text-sm text-gray-600">{email}</p>
      <div className="flex items-center gap-2 mt-1">
        <Calendar size={14} className="text-gray-400" />
        <span className="text-sm text-gray-600">Joined {joinDate}</span>
        <span className="text-gray-400">•</span>
        <Calendar size={14} className="text-gray-400" />
        <span className="text-sm text-gray-600">{eventCount} events</span>
      </div>
    </div>
    <ChevronRight size={16} className="text-gray-400" />
  </div>
);

const AdminDashboard = () => {
  const { data: analytics } = useGetUserAnalyticsManager();

  const stats = [
    {
      icon: Users,
      label: "Total Users",
      value: analytics?.data?.totalUsers,
      trend: null,
    },
    {
      icon: Calendar,
      label: "Active Events",
      value: analytics?.data?.totalActiveEvents,
      trend: null,
    },
    {
      icon: DollarSign,
      label: "Revenue",
      value: analytics?.data?.totalRevenueDollar,
      trend: null,
    },
    {
      icon: Activity,
      label: "Platform Usage",
      value: analytics?.data?.totalRevenueNaira,
      trend: null,
    },
  ];

  const alerts = [
    {
      title: "High Server Load",
      description: "Server CPU usage exceeded 90% in the last hour",
      time: "15m ago",
      priority: "high",
    },
    {
      title: "Payment System Warning",
      description: "3 failed payment attempts detected",
      time: "1h ago",
      priority: "medium",
    },
    {
      title: "New User Spike",
      description: "Unusual increase in new user registrations",
      time: "2h ago",
      priority: "medium",
    },
  ];

  const recentUsers = [
    {
      name: "Emma Wilson",
      email: "emma@example.com",
      joinDate: "2h ago",
      eventCount: 3,
    },
    {
      name: "James Chen",
      email: "james@example.com",
      joinDate: "5h ago",
      eventCount: 1,
    },
    {
      name: "Sarah Miller",
      email: "sarah@example.com",
      joinDate: "1d ago",
      eventCount: 2,
    },
  ];

  return (
    <BaseDashboardNavigation title="Admin Dashboard">
      <div className="p-6 space-y-6 bg-gray-50 min-h-screen text-brandBlack">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">Admin Dashboard</h1>
            <p className="text-gray-600 mt-1">
              Platform overview and management
            </p>
          </div>
          <Link href="/admin/settings">
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors">
              <Settings size={20} />
              Platform Settings
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
              <div className="p-4 border-b flex justify-between items-center">
                <h2 className="font-semibold">Platform Metrics</h2>
                <Link
                  href="/admin/metrics"
                  className="text-blue-600 text-sm hover:underline"
                >
                  View details
                </Link>
              </div>
              <div className="p-4 h-64 flex items-center justify-center text-gray-500">
                [Metrics Chart Placeholder]
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm">
              <div className="p-4 border-b flex justify-between items-center">
                <h2 className="font-semibold">Recent Users</h2>
                <Link
                  href="/admin/users"
                  className="text-blue-600 text-sm hover:underline"
                >
                  Manage users
                </Link>
              </div>
              <div className="divide-y">
                {recentUsers.map((user, index) => (
                  <RecentUser key={index} {...user} />
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm">
              <div className="p-4 border-b">
                <h2 className="font-semibold">System Alerts</h2>
              </div>
              <div className="divide-y">
                {alerts.map((alert, index) => (
                  <AlertCard key={index} {...alert} />
                ))}
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm">
              <h3 className="font-semibold mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <Link
                  href="/admin/backups"
                  className="block p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  System Backup
                </Link>
                <Link
                  href="/admin/maintenance"
                  className="block p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  Maintenance Mode
                </Link>
                <Link
                  href="/admin/notifications"
                  className="block p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  Send Announcement
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </BaseDashboardNavigation>
  );
};

export default AdminDashboard;
