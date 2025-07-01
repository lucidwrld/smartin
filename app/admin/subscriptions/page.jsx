"use client";

import React, { useState } from "react";
import { 
  Users, 
  Package, 
  DollarSign, 
  TrendingUp, 
  Search, 
  Filter,
  Download,
  Eye,
  Edit2,
  Trash2,
  Crown,
  Star,
  Calendar,
  CreditCard
} from "lucide-react";
import BaseDashboardNavigation from "@/components/BaseDashboardNavigation";
import StatusCard from "@/components/StatusCard";
import CustomButton from "@/components/Button";

const AdminSubscriptionsPage = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [searchTerm, setSearchTerm] = useState("");
  
  // Mock data
  const subscriptionStats = {
    totalSubscribers: 1247,
    activeSubscriptions: 983,
    monthlyRevenue: 48750,
    churnRate: 3.2
  };

  const plans = [
    {
      id: "free",
      name: "Free Plan",
      price: 0,
      billing: "one-time",
      subscribers: 234,
      revenue: 0,
      features: ["3 events", "50 guests", "Basic support"]
    },
    {
      id: "premium", 
      name: "Premium",
      price: 29.99,
      billing: "monthly",
      subscribers: 567,
      revenue: 17003.33,
      features: ["10 events", "200 guests", "Priority support", "Analytics"]
    },
    {
      id: "vip",
      name: "VIP", 
      price: 99.99,
      billing: "monthly",
      subscribers: 182,
      revenue: 18198,
      features: ["Unlimited events", "Unlimited guests", "24/7 support", "White-label"]
    }
  ];

  const recentSubscriptions = [
    { id: 1, user: "John Doe", email: "john@example.com", plan: "Premium", status: "active", date: "2024-07-20", amount: 29.99 },
    { id: 2, user: "Jane Smith", email: "jane@example.com", plan: "VIP", status: "active", date: "2024-07-19", amount: 99.99 },
    { id: 3, user: "Bob Wilson", email: "bob@example.com", plan: "Premium", status: "cancelled", date: "2024-07-18", amount: 29.99 },
    { id: 4, user: "Alice Brown", email: "alice@example.com", plan: "VIP", status: "active", date: "2024-07-17", amount: 99.99 },
    { id: 5, user: "Charlie Davis", email: "charlie@example.com", plan: "Premium", status: "active", date: "2024-07-16", amount: 29.99 }
  ];

  const cards = [
    { title: "Total Subscribers", count: subscriptionStats.totalSubscribers, icon: Users },
    { title: "Active Subscriptions", count: subscriptionStats.activeSubscriptions, icon: Package },
    { title: "Monthly Revenue", count: `$${subscriptionStats.monthlyRevenue.toLocaleString()}`, icon: DollarSign },
    { title: "Churn Rate", count: `${subscriptionStats.churnRate}%`, icon: TrendingUp }
  ];

  const filteredSubscriptions = recentSubscriptions.filter(sub =>
    sub.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
    sub.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    sub.plan.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status) => {
    switch (status) {
      case "active": return "bg-green-100 text-green-800";
      case "cancelled": return "bg-red-100 text-red-800";
      case "pending": return "bg-yellow-100 text-yellow-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getPlanIcon = (planName) => {
    if (planName.toLowerCase().includes("vip")) return Crown;
    if (planName.toLowerCase().includes("premium")) return Star;
    return Package;
  };

  return (
    <BaseDashboardNavigation title="Subscription Management">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 p-4">
        {cards.map((card, index) => (
          <StatusCard key={index} {...card} />
        ))}
      </div>

      {/* Tabs */}
      <div className="border-b mx-4">
        <div className="flex space-x-8">
          {["overview", "plans", "subscribers", "analytics"].map(tab => (
            <button
              key={tab}
              className={`py-2 px-1 border-b-2 font-medium text-sm capitalize ${
                activeTab === tab
                  ? "border-purple-500 text-purple-600"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      <div className="p-4">
        {/* Overview Tab */}
        {activeTab === "overview" && (
          <div className="space-y-6">
            {/* Plans Overview */}
            <div className="bg-white rounded-lg border p-6">
              <h3 className="text-lg font-semibold mb-4">Subscription Plans Performance</h3>
              <div className="grid md:grid-cols-3 gap-6">
                {plans.map(plan => {
                  const Icon = getPlanIcon(plan.name);
                  return (
                    <div key={plan.id} className="border rounded-lg p-4">
                      <div className="flex items-center gap-3 mb-3">
                        <Icon className="w-6 h-6 text-purple-600" />
                        <div>
                          <h4 className="font-medium">{plan.name}</h4>
                          <p className="text-sm text-gray-600">
                            ${plan.price}{plan.billing !== "one-time" ? `/${plan.billing}` : ""}
                          </p>
                        </div>
                      </div>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span>Subscribers:</span>
                          <span className="font-medium">{plan.subscribers}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Revenue:</span>
                          <span className="font-medium">${plan.revenue.toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-lg border p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Recent Subscriptions</h3>
                <div className="flex gap-2">
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Search subscriptions..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-8 pr-4 py-2 border rounded-md focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                    />
                    <Search className="w-4 h-4 absolute left-2 top-3 text-gray-400" />
                  </div>
                  <CustomButton
                    buttonText="Export"
                    prefixIcon={<Download className="w-4 h-4" />}
                    buttonColor="bg-gray-600"
                    radius="rounded-md"
                  />
                </div>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="text-left p-3 font-medium text-gray-700">User</th>
                      <th className="text-left p-3 font-medium text-gray-700">Plan</th>
                      <th className="text-left p-3 font-medium text-gray-700">Status</th>
                      <th className="text-left p-3 font-medium text-gray-700">Date</th>
                      <th className="text-left p-3 font-medium text-gray-700">Amount</th>
                      <th className="text-left p-3 font-medium text-gray-700">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredSubscriptions.map(sub => (
                      <tr key={sub.id} className="border-t hover:bg-gray-50">
                        <td className="p-3">
                          <div>
                            <div className="font-medium">{sub.user}</div>
                            <div className="text-sm text-gray-600">{sub.email}</div>
                          </div>
                        </td>
                        <td className="p-3">{sub.plan}</td>
                        <td className="p-3">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(sub.status)}`}>
                            {sub.status}
                          </span>
                        </td>
                        <td className="p-3 text-sm text-gray-600">
                          {new Date(sub.date).toLocaleDateString()}
                        </td>
                        <td className="p-3 font-medium">${sub.amount}</td>
                        <td className="p-3">
                          <div className="flex gap-1">
                            <button className="p-1 text-gray-500 hover:text-blue-600">
                              <Eye className="w-4 h-4" />
                            </button>
                            <button className="p-1 text-gray-500 hover:text-green-600">
                              <Edit2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Plans Tab */}
        {activeTab === "plans" && (
          <div className="bg-white rounded-lg border p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold">Manage Subscription Plans</h3>
              <CustomButton
                buttonText="Create New Plan"
                buttonColor="bg-purple-600"
                radius="rounded-md"
              />
            </div>
            
            <div className="grid gap-6">
              {plans.map(plan => {
                const Icon = getPlanIcon(plan.name);
                return (
                  <div key={plan.id} className="border rounded-lg p-6">
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-4">
                        <Icon className="w-8 h-8 text-purple-600" />
                        <div>
                          <h4 className="text-xl font-semibold">{plan.name}</h4>
                          <p className="text-2xl font-bold text-purple-600">
                            ${plan.price}{plan.billing !== "one-time" ? `/${plan.billing}` : ""}
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <CustomButton
                          buttonText="Edit"
                          prefixIcon={<Edit2 className="w-4 h-4" />}
                          buttonColor="bg-blue-600"
                          radius="rounded-md"
                        />
                        <button className="p-2 text-gray-500 hover:text-red-600">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    
                    <div className="mt-4 grid md:grid-cols-3 gap-4">
                      <div>
                        <span className="text-sm text-gray-600">Subscribers</span>
                        <p className="text-xl font-semibold">{plan.subscribers}</p>
                      </div>
                      <div>
                        <span className="text-sm text-gray-600">Monthly Revenue</span>
                        <p className="text-xl font-semibold">${plan.revenue.toLocaleString()}</p>
                      </div>
                      <div>
                        <span className="text-sm text-gray-600">Features</span>
                        <p className="text-sm">{plan.features.length} features</p>
                      </div>
                    </div>
                    
                    <div className="mt-4">
                      <h5 className="font-medium mb-2">Features:</h5>
                      <div className="flex flex-wrap gap-2">
                        {plan.features.map((feature, idx) => (
                          <span key={idx} className="px-2 py-1 bg-gray-100 rounded text-sm">
                            {feature}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Subscribers Tab */}
        {activeTab === "subscribers" && (
          <div className="bg-white rounded-lg border p-6">
            <h3 className="text-lg font-semibold mb-4">All Subscribers</h3>
            <p className="text-gray-600">Detailed subscriber management interface would go here.</p>
          </div>
        )}

        {/* Analytics Tab */}
        {activeTab === "analytics" && (
          <div className="bg-white rounded-lg border p-6">
            <h3 className="text-lg font-semibold mb-4">Subscription Analytics</h3>
            <p className="text-gray-600">Revenue trends, conversion rates, and detailed analytics would go here.</p>
          </div>
        )}
      </div>
    </BaseDashboardNavigation>
  );
};

export default AdminSubscriptionsPage;