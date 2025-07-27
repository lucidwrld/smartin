"use client";

import React, { useState } from "react";
import { 
  CheckCircle, 
  Star, 
  Crown, 
  Package, 
  CreditCard,
  Clock,
  Users,
  Zap,
  Shield,
  Headphones
} from "lucide-react";
import BaseDashboardNavigation from "@/components/BaseDashboardNavigation";
import CustomButton from "@/components/Button";
import useGetPlansManager from "@/components/subscriptions/controllers/getPlansController";
import useGetUserSubscriptionsManager from "@/components/subscriptions/controllers/getUserSubscriptionsController";
import { PurchaseSubscriptionManager } from "@/components/subscriptions/controllers/purchaseSubscriptionController";
import { RenewSubscriptionManager } from "@/components/subscriptions/controllers/renewSubscriptionController";
import { CancelSubscriptionManager } from "@/components/subscriptions/controllers/cancelSubscriptionController";
import useGetUserDetailsManager from "@/app/profile-settings/controllers/get_UserDetails_controller";

const SubscriptionsPage = () => {
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [activeTab, setActiveTab] = useState("plans");
  
  // Get user details and currency
  const { data: userDetails } = useGetUserDetailsManager();
  const userCurrency = userDetails?.data?.user?.currency || "USD";
  
  // Fetch data based on user's currency
  const { data: plansResponse, isLoading: plansLoading } = useGetPlansManager({ currency: userCurrency });
  const { data: userSubscriptions, isLoading: subscriptionsLoading, refetch: refetchSubscriptions } = useGetUserSubscriptionsManager({});
  const { purchaseSubscription, isLoading: purchasing } = PurchaseSubscriptionManager();
  const { cancelSubscription, isLoading: canceling } = CancelSubscriptionManager();

  const plans = plansResponse?.data || [];
  const currentSubscription = userSubscriptions?.subscriptions?.find(sub => sub.status === 'active');
  
  // Now we can use currentSubscription safely
  const { renewSubscription, isLoading: renewing } = RenewSubscriptionManager({ subscriptionId: currentSubscription?.id });

  const handlePurchase = async (plan) => {
    try {
      const purchaseData = {
        planId: plan._id || plan.id,
        duration: 1, // Default to 1 month
        path: "/subscriptions/confirm"
      };
      
      await purchaseSubscription(purchaseData);
      refetchSubscriptions();
    } catch (error) {
      console.error("Purchase failed:", error);
    }
  };

  const handleRenewSubscription = async (plan) => {
    try {
      const renewData = {
        planId: plan._id || plan.id,
        duration: 1
      };
      
      await renewSubscription(renewData);
      refetchSubscriptions();
    } catch (error) {
      console.error("Renewal failed:", error);
    }
  };

  const handleCancelSubscription = async () => {
    if (confirm("Are you sure you want to cancel your subscription? This action cannot be undone.")) {
      try {
        await cancelSubscription();
        refetchSubscriptions();
      } catch (error) {
        console.error("Cancellation failed:", error);
      }
    }
  };

  const getPlanIcon = (planName) => {
    const name = planName?.toLowerCase() || '';
    if (name.includes('business')) return Crown;
    if (name.includes('premium')) return Star;
    return Package;
  };

  const planFeatures = {
    free: [
      "Create up to 3 events",
      "Invite up to 50 guests per event",
      "Basic email invitations",
      "Standard support"
    ],
    premium: [
      "Unlimited events",
      "Unlimited guests",
      "All invitation channels (Email, SMS, WhatsApp, Voice)",
      "Advanced analytics",
      "Priority support",
      "Custom branding"
    ],
    business: [
      "Everything in Premium",
      "Team collaboration (up to 10 members)",
      "API access",
      "White-label solution",
      "24/7 dedicated support",
      "Advanced security features"
    ]
  };

  const getFeatures = (planName) => {
    const name = planName?.toLowerCase() || '';
    if (name.includes('business')) return planFeatures.business;
    if (name.includes('premium')) return planFeatures.premium;
    return planFeatures.free;
  };

  const isCurrentPlan = (plan) => {
    return currentSubscription?.planId === (plan._id || plan.id);
  };

  return (
    <BaseDashboardNavigation title="Subscription Plans">
      <div className="max-w-7xl mx-auto py-8 px-4">
        {/* Current Subscription Status */}
        {currentSubscription && (
          <div className="mb-8 bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Current Subscription</h3>
                <p className="text-green-600 font-medium">{currentSubscription.planName || 'Active Plan'}</p>
                <p className="text-sm text-gray-600">
                  Expires: {new Date(currentSubscription.expiryDate).toLocaleDateString()}
                </p>
              </div>
              <CheckCircle className="w-12 h-12 text-green-500" />
            </div>
          </div>
        )}

        {/* Tabs */}
        <div className="border-b mb-8">
          <div className="flex space-x-8 justify-center">
            {["plans", "manage"].map(tab => (
              <button
                key={tab}
                className={`py-2 px-1 border-b-2 font-medium text-sm capitalize ${
                  activeTab === tab
                    ? "border-purple-500 text-purple-600"
                    : "border-transparent text-gray-500 hover:text-gray-700"
                }`}
                onClick={() => setActiveTab(tab)}
              >
                {tab === "plans" ? "Available Plans" : "Manage Subscription"}
              </button>
            ))}
          </div>
        </div>

        {/* Plans Tab */}
        {activeTab === "plans" && (
          <>
            {/* Header */}
            <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Choose Your Plan</h1>
          <p className="text-gray-600 mb-2">Select the perfect plan for your event management needs</p>
          <p className="text-sm text-gray-500">
            Showing plans in {userCurrency} based on your profile settings
          </p>
        </div>

        {/* Plans Grid */}
        {plansLoading ? (
          <div className="flex justify-center py-12">
            <div className="text-gray-500">Loading plans...</div>
          </div>
        ) : plans.length === 0 ? (
          <div className="text-center py-12">
            <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No plans available</h3>
            <p className="text-gray-500">Please check back later for available subscription plans.</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {plans.map((plan) => {
              const Icon = getPlanIcon(plan.name);
              const features = getFeatures(plan.name);
              const isCurrent = isCurrentPlan(plan);
              const isBusinessPlan = plan.name?.toLowerCase().includes('business');
              
              return (
                <div
                  key={plan._id || plan.id}
                  className={`relative bg-white rounded-2xl shadow-lg border-2 transition-all hover:shadow-xl ${
                    isBusinessPlan 
                      ? "border-purple-500 transform scale-105" 
                      : "border-gray-200 hover:border-purple-300"
                  }`}
                >
                  {isBusinessPlan && (
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                      <span className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-4 py-1 rounded-full text-sm font-medium">
                        Most Popular
                      </span>
                    </div>
                  )}
                  
                  <div className="p-8">
                    {/* Plan Header */}
                    <div className="text-center mb-8">
                      <Icon className={`w-12 h-12 mx-auto mb-4 ${
                        isBusinessPlan ? "text-purple-600" : "text-blue-600"
                      }`} />
                      <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                      <div className="mb-4">
                        <span className="text-4xl font-bold text-gray-900">
                          {userCurrency} {plan.price?.toLocaleString() || '0'}
                        </span>
                        <span className="text-gray-500">/{plan.duration} days</span>
                      </div>
                      <p className="text-gray-600 text-sm">{plan.description}</p>
                    </div>

                    {/* Features */}
                    <div className="mb-8">
                      <ul className="space-y-3">
                        {features.map((feature, index) => (
                          <li key={index} className="flex items-start">
                            <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                            <span className="text-gray-600 text-sm">{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Action Button */}
                    <div className="text-center">
                      {isCurrent ? (
                        <div className="w-full py-3 px-4 bg-green-100 text-green-700 rounded-lg font-medium">
                          Current Plan
                        </div>
                      ) : (
                        <CustomButton
                          buttonText={purchasing ? "Processing..." : "Subscribe Now"}
                          buttonColor={isBusinessPlan ? "bg-purple-600" : "bg-blue-600"}
                          textColor="text-white"
                          radius="rounded-lg"
                          className="w-full"
                          isLoading={purchasing}
                          onClick={() => handlePurchase(plan)}
                        />
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* FAQ or Additional Info */}
        <div className="mt-16 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Why Subscribe?</h2>
          <div className="grid md:grid-cols-3 gap-8 mt-8">
            <div className="text-center">
              <Zap className="w-8 h-8 text-yellow-500 mx-auto mb-3" />
              <h3 className="font-semibold text-gray-900 mb-2">Unlimited Events</h3>
              <p className="text-gray-600 text-sm">Create as many events as you need without limits</p>
            </div>
            <div className="text-center">
              <Shield className="w-8 h-8 text-green-500 mx-auto mb-3" />
              <h3 className="font-semibold text-gray-900 mb-2">Advanced Features</h3>
              <p className="text-gray-600 text-sm">Access to all invitation channels and analytics</p>
            </div>
            <div className="text-center">
              <Headphones className="w-8 h-8 text-blue-500 mx-auto mb-3" />
              <h3 className="font-semibold text-gray-900 mb-2">Priority Support</h3>
              <p className="text-gray-600 text-sm">Get help when you need it with priority support</p>
            </div>
          </div>
        </div>
          </>
        )}

        {/* Manage Subscription Tab */}
        {activeTab === "manage" && (
          <SubscriptionManagement 
            currentSubscription={currentSubscription}
            userSubscriptions={userSubscriptions?.subscriptions || []}
            userCurrency={userCurrency}
            onRenew={handleRenewSubscription}
            onCancel={handleCancelSubscription}
            isLoading={subscriptionsLoading}
            isRenewing={renewing}
            isCanceling={canceling}
          />
        )}
      </div>
    </BaseDashboardNavigation>
  );
};

// Subscription Management Component
const SubscriptionManagement = ({ 
  currentSubscription, 
  userSubscriptions, 
  userCurrency,
  onRenew, 
  onCancel, 
  isLoading,
  isRenewing,
  isCanceling 
}) => {
  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <div className="text-gray-500">Loading subscription details...</div>
      </div>
    );
  }

  if (!currentSubscription) {
    return (
      <div className="text-center py-12">
        <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No Active Subscription</h3>
        <p className="text-gray-500">You don't have an active subscription. Choose a plan to get started.</p>
      </div>
    );
  }

  const expiry = new Date(currentSubscription.expiryDate);
  const isExpiringSoon = expiry.getTime() - new Date().getTime() < 7 * 24 * 60 * 60 * 1000; // 7 days

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Current Subscription Card */}
      <div className="bg-white rounded-lg border p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-6">Current Subscription</h3>
        
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-500">Plan Name</label>
                <p className="text-lg font-semibold text-gray-900">{currentSubscription.planName || 'Active Plan'}</p>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-500">Status</label>
                <p className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  currentSubscription.status === 'active' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {currentSubscription.status}
                </p>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-500">Expires On</label>
                <p className={`text-lg ${isExpiringSoon ? 'text-red-600 font-semibold' : 'text-gray-900'}`}>
                  {expiry.toLocaleDateString()}
                </p>
                {isExpiringSoon && (
                  <p className="text-sm text-red-500">Expires soon!</p>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <CustomButton
              buttonText={isRenewing ? "Renewing..." : "Renew Subscription"}
              buttonColor="bg-green-600"
              textColor="text-white"
              radius="rounded-lg"
              className="w-full"
              isLoading={isRenewing}
              onClick={() => onRenew(currentSubscription)}
            />
            
            <CustomButton
              buttonText={isCanceling ? "Canceling..." : "Cancel Subscription"}
              buttonColor="bg-red-600"
              textColor="text-white"
              radius="rounded-lg"
              className="w-full"
              isLoading={isCanceling}
              onClick={onCancel}
            />
          </div>
        </div>
      </div>

      {/* Subscription History */}
      <div className="bg-white rounded-lg border p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-6">Subscription History</h3>
        
        {userSubscriptions.length === 0 ? (
          <p className="text-gray-500 text-center py-4">No subscription history available.</p>
        ) : (
          <div className="space-y-4">
            {userSubscriptions.map((subscription, index) => (
              <div key={subscription.id || index} className="border rounded-lg p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-medium text-gray-900">{subscription.planName || 'Plan'}</h4>
                    <p className="text-sm text-gray-600">
                      {new Date(subscription.startDate).toLocaleDateString()} - {new Date(subscription.expiryDate).toLocaleDateString()}
                    </p>
                  </div>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    subscription.status === 'active' 
                      ? 'bg-green-100 text-green-800'
                      : subscription.status === 'expired'
                      ? 'bg-red-100 text-red-800' 
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {subscription.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SubscriptionsPage;