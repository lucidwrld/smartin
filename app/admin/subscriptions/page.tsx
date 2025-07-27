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
  CreditCard,
  Plus
} from "lucide-react";
import BaseDashboardNavigation from "@/components/BaseDashboardNavigation";
import StatusCard from "@/components/StatusCard";
import CustomButton from "@/components/Button";
import useGetPlansManager from "@/components/subscriptions/controllers/getPlansController";
import { CreatePlanManager } from "@/components/subscriptions/controllers/createPlanController";
import { UpdatePlanManager } from "@/components/subscriptions/controllers/updatePlanController";
import { DeletePlanManager } from "@/components/subscriptions/controllers/deletePlanController";
import DeleteConfirmationModal from "@/components/DeleteConfirmationModal";

const AdminSubscriptionsPage = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [searchTerm, setSearchTerm] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingPlan, setEditingPlan] = useState(null);
  const [currency, setCurrency] = useState("NGN");
  const [planToDelete, setPlanToDelete] = useState(null);
  
  // Real data fetching
  const { data: plansResponse, isLoading: plansLoading, refetch: refetchPlans } = useGetPlansManager({ currency });
  const { createPlan, isLoading: creating } = CreatePlanManager();
  
  const plans = plansResponse?.data || [];
  
  // Debug logging
  console.log('Plans Response:', plansResponse);
  console.log('Plans Data:', plans);
  
  // Mock data for stats (replace with real API later)
  const subscriptionStats = {
    totalSubscribers: 1247,
    activeSubscriptions: 983,
    monthlyRevenue: 48750,
    churnRate: 3.2
  };


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
                    <div key={plan._id || plan.id} className="border rounded-lg p-4">
                      <div className="flex items-center gap-3 mb-3">
                        <Icon className="w-6 h-6 text-purple-600" />
                        <div>
                          <h4 className="font-medium">{plan?.name || 'Unnamed Plan'}</h4>
                          <p className="text-sm text-gray-600">
                            {plan?.currency} {typeof plan?.price === 'number' ? plan.price.toLocaleString() : '0'}
                          </p>
                        </div>
                      </div>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span>Status:</span>
                          <span className={`font-medium ${plan?.active ? 'text-green-600' : 'text-red-600'}`}>
                            {plan?.active ? 'Active' : 'Inactive'}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>Duration:</span>
                          <span className="font-medium">{plan?.duration || 0} days</span>
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
              <div className="flex items-center gap-4">
                <h3 className="text-lg font-semibold">Manage Subscription Plans</h3>
                <select
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value)}
                  className="px-3 py-2 border rounded-md focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                >
                  <option value="NGN">NGN</option>
                  <option value="USD">USD</option>
                </select>
              </div>
              <CustomButton
                buttonText="Create New Plan"
                prefixIcon={<Plus className="w-4 h-4" />}
                buttonColor="bg-purple-600"
                radius="rounded-md"
                onClick={() => setShowCreateModal(true)}
              />
            </div>
            
            {plansLoading ? (
              <div className="flex justify-center py-8">
                <div className="text-gray-500">Loading plans...</div>
              </div>
            ) : plans.length === 0 ? (
              <div className="text-center py-8">
                <Package className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No plans found</h3>
                <p className="text-gray-500 mb-4">Create your first subscription plan to get started.</p>
                <CustomButton
                  buttonText="Create First Plan"
                  buttonColor="bg-purple-600"
                  radius="rounded-md"
                  onClick={() => setShowCreateModal(true)}
                />
              </div>
            ) : (
              <div className="grid gap-6">
                {plans.map(plan => {
                  const Icon = getPlanIcon(plan.name);
                  return (
                    <div key={plan._id || plan.id} className="border rounded-lg p-6">
                      <div className="flex justify-between items-start">
                        <div className="flex items-center gap-4">
                          <Icon className="w-8 h-8 text-purple-600" />
                          <div>
                            <h4 className="text-xl font-semibold">{plan?.name || 'Unnamed Plan'}</h4>
                            <p className="text-2xl font-bold text-purple-600">
                              {plan?.currency || 'NGN'} {typeof plan?.price === 'number' ? plan.price.toLocaleString() : '0'}
                            </p>
                            <p className="text-sm text-gray-600">Duration: {plan?.duration || 0} days</p>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <CustomButton
                            buttonText="Edit"
                            prefixIcon={<Edit2 className="w-4 h-4" />}
                            buttonColor="bg-blue-600"
                            radius="rounded-md"
                            onClick={() => setEditingPlan(plan)}
                          />
                          <DeletePlanButton 
                            planId={plan._id || plan.id} 
                            planName={plan?.name || 'Plan'}
                            onDelete={() => setPlanToDelete(plan)}
                          />
                        </div>
                      </div>
                      
                      <div className="mt-4 grid md:grid-cols-2 gap-4">
                        <div>
                          <span className="text-sm text-gray-600">Status</span>
                          <p className={`text-sm font-medium ${plan.active ? 'text-green-600' : 'text-red-600'}`}>
                            {plan.active ? 'Active' : 'Inactive'}
                          </p>
                        </div>
                        <div>
                          <span className="text-sm text-gray-600">Created</span>
                          <p className="text-sm">{plan?.createdAt ? new Date(plan.createdAt).toLocaleDateString() : 'N/A'}</p>
                        </div>
                      </div>
                      
                      <div className="mt-4">
                        <h5 className="font-medium mb-2">Description:</h5>
                        <p className="text-sm text-gray-600">{plan.description}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
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

      {/* Create/Edit Plan Modal */}
      {(showCreateModal || editingPlan) && (
        <PlanModal
          plan={editingPlan}
          isOpen={showCreateModal || !!editingPlan}
          onClose={() => {
            setShowCreateModal(false);
            setEditingPlan(null);
          }}
          onSuccess={() => {
            refetchPlans();
            setShowCreateModal(false);
            setEditingPlan(null);
          }}
        />
      )}

      {/* Delete Confirmation Modal */}
      <DeletePlanConfirmationModal 
        plan={planToDelete}
        onSuccess={() => {
          refetchPlans();
          setPlanToDelete(null);
        }}
      />
    </BaseDashboardNavigation>
  );
};

// Delete Plan Button Component
const DeletePlanButton = ({ planId, planName, onDelete }) => {
  const handleDelete = () => {
    onDelete();
    document.getElementById("delete").showModal();
  };

  return (
    <button 
      onClick={handleDelete}
      className="p-2 text-gray-500 hover:text-red-600"
    >
      <Trash2 className="w-4 h-4" />
    </button>
  );
};

// Plan Modal Component
const PlanModal = ({ plan, isOpen, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    duration: "",
    currency: "NGN",
    isActive: true
  });

  const { createPlan, isLoading: creating } = CreatePlanManager();
  const { updatePlan, isLoading: updating } = UpdatePlanManager({ planId: plan?._id || plan?.id });

  React.useEffect(() => {
    if (plan) {
      setFormData({
        name: plan.name || "",
        description: plan.description || "",
        price: plan.price || "",
        duration: plan.duration || "",
        currency: plan.currency || "NGN",
        isActive: plan.active !== undefined ? plan.active : true
      });
    } else {
      setFormData({
        name: "",
        description: "",
        price: "",
        duration: "",
        currency: "NGN",
        isActive: true
      });
    }
  }, [plan]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const details = {
      name: formData.name,
      description: formData.description,
      price: Number(formData.price),
      duration: Number(formData.duration),
      currency: formData.currency,
      isActive: formData.isActive
    };

    try {
      if (plan) {
        await updatePlan(details);
      } else {
        await createPlan(details);
      }
      onSuccess();
    } catch (error) {
      console.error("Error saving plan:", error);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-md w-full p-6">
        <h3 className="text-lg font-semibold mb-4">
          {plan ? "Edit Plan" : "Create New Plan"}
        </h3>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Plan Name *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-purple-500 focus:border-purple-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description *
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-purple-500 focus:border-purple-500"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Price *
              </label>
              <input
                type="number"
                value={formData.price}
                onChange={(e) => handleInputChange("price", e.target.value)}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                required
                min="0"
                step="0.01"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Currency *
              </label>
              <select
                value={formData.currency}
                onChange={(e) => handleInputChange("currency", e.target.value)}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-purple-500 focus:border-purple-500"
              >
                <option value="NGN">NGN</option>
                <option value="USD">USD</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Duration (days) *
            </label>
            <input
              type="number"
              value={formData.duration}
              onChange={(e) => handleInputChange("duration", e.target.value)}
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-purple-500 focus:border-purple-500"
              required
              min="1"
            />
          </div>

          <div>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={formData.isActive}
                onChange={(e) => handleInputChange("isActive", e.target.checked)}
                className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
              />
              <span className="text-sm font-medium text-gray-700">Active Plan</span>
            </label>
          </div>

          <div className="flex gap-3 pt-4">
            <CustomButton
              buttonText={plan ? "Update Plan" : "Create Plan"}
              buttonColor="bg-purple-600"
              radius="rounded-md"
              type="submit"
              isLoading={creating || updating}
            />
            <CustomButton
              buttonText="Cancel"
              buttonColor="bg-gray-300"
              textColor="text-gray-700"
              radius="rounded-md"
              onClick={onClose}
            />
          </div>
        </form>
      </div>
    </div>
  );
};

// Delete Plan Confirmation Modal Component
const DeletePlanConfirmationModal = ({ plan, onSuccess }) => {
  const { deletePlan, isLoading } = DeletePlanManager({ planId: plan?._id || plan?.id });

  const handleConfirmDelete = async () => {
    if (plan) {
      await deletePlan();
      onSuccess();
      document.getElementById("delete").close();
    }
  };

  if (!plan) return null;

  return (
    <DeleteConfirmationModal
      id="delete"
      title="Delete Plan"
      body={`Are you sure you want to delete "${plan?.name || 'this plan'}"? This action cannot be undone.`}
      buttonText="Delete Plan"
      buttonColor="bg-red-600"
      isLoading={isLoading}
      onClick={handleConfirmDelete}
      successFul={false}
    />
  );
};

export default AdminSubscriptionsPage;