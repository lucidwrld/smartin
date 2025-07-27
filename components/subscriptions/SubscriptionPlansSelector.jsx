t"use client";

import React, { useState } from "react";
import { Check, Crown, Star, Zap } from "lucide-react";
import CustomButton from "@/components/Button";

const SubscriptionPlansSelector = ({ currentPlan, onSelectPlan }) => {
  const [selectedBillingCycle, setSelectedBillingCycle] = useState("monthly");

  const plans = [
    {
      id: "free",
      name: "Free",
      description: "Perfect for trying out our platform",
      price: {
        monthly: 0,
        yearly: 0
      },
      icon: Zap,
      color: "gray",
      features: [
        "Create up to 3 events",
        "50 guests per event",
        "Basic event templates",
        "Email invitations",
        "Standard support"
      ],
      limits: {
        events_per_month: 3,
        guests_per_event: 50,
        custom_branding: false,
        priority_support: false
      }
    },
    {
      id: "premium",
      name: "Premium",
      description: "Great for regular event organizers",
      price: {
        monthly: 29.99,
        yearly: 299.99
      },
      icon: Star,
      color: "blue",
      popular: true,
      features: [
        "Create up to 10 events per month",
        "200 guests per event",
        "Advanced event templates",
        "Email & SMS invitations",
        "Custom branding",
        "Analytics dashboard",
        "Priority support",
        "Ticketing & payments"
      ],
      limits: {
        events_per_month: 10,
        guests_per_event: 200,
        custom_branding: true,
        priority_support: true
      }
    },
    {
      id: "vip",
      name: "VIP",
      description: "For professional event managers",
      price: {
        monthly: 99.99,
        yearly: 999.99
      },
      icon: Crown,
      color: "purple",
      features: [
        "Unlimited events",
        "Unlimited guests",
        "All premium features",
        "White-label solution",
        "API access",
        "Dedicated account manager",
        "24/7 phone support",
        "Custom integrations",
        "Team collaboration"
      ],
      limits: {
        events_per_month: "unlimited",
        guests_per_event: "unlimited",
        custom_branding: true,
        priority_support: true,
        api_access: true
      }
    }
  ];

  const formatPrice = (price) => {
    if (price === 0) return "Free";
    return `$${price}${selectedBillingCycle === "yearly" ? "/year" : "/month"}`;
  };

  const calculateSavings = (plan) => {
    if (plan.price.monthly === 0) return 0;
    const yearlySavings = (plan.price.monthly * 12) - plan.price.yearly;
    return Math.round((yearlySavings / (plan.price.monthly * 12)) * 100);
  };

  return (
    <div className="space-y-6">
      {/* Billing Cycle Toggle */}
      <div className="flex justify-center">
        <div className="bg-gray-100 p-1 rounded-lg flex">
          <button
            onClick={() => setSelectedBillingCycle("monthly")}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              selectedBillingCycle === "monthly"
                ? "bg-white text-gray-900 shadow"
                : "text-gray-500"
            }`}
          >
            Monthly
          </button>
          <button
            onClick={() => setSelectedBillingCycle("yearly")}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              selectedBillingCycle === "yearly"
                ? "bg-white text-gray-900 shadow"
                : "text-gray-500"
            }`}
          >
            Yearly
            {plans.some(p => calculateSavings(p) > 0) && (
              <span className="ml-1 text-green-600 text-xs">Save up to {Math.max(...plans.map(calculateSavings))}%</span>
            )}
          </button>
        </div>
      </div>

      {/* Plans Grid */}
      <div className="grid md:grid-cols-3 gap-6">
        {plans.map((plan) => {
          const Icon = plan.icon;
          const isCurrentPlan = currentPlan?.id === plan.id;
          const savings = calculateSavings(plan);

          return (
            <div
              key={plan.id}
              className={`relative bg-white rounded-lg p-6 ${
                plan.popular
                  ? "border-2 border-blue-500 shadow-lg"
                  : "border border-gray-200"
              } ${isCurrentPlan ? "bg-gray-50" : ""}`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <span className="bg-blue-500 text-white px-3 py-1 rounded-full text-xs font-medium">
                    Most Popular
                  </span>
                </div>
              )}

              <div className="text-center mb-6">
                <div className={`w-12 h-12 mx-auto rounded-lg flex items-center justify-center mb-4 ${
                  plan.color === "purple" ? "bg-purple-100 text-purple-600" :
                  plan.color === "blue" ? "bg-blue-100 text-blue-600" :
                  "bg-gray-100 text-gray-600"
                }`}>
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{plan.name}</h3>
                <p className="text-gray-600 text-sm mb-4">{plan.description}</p>
                <div className="mb-2">
                  <span className="text-3xl font-bold">
                    {formatPrice(plan.price[selectedBillingCycle])}
                  </span>
                </div>
                {selectedBillingCycle === "yearly" && savings > 0 && (
                  <p className="text-green-600 text-sm">Save {savings}% annually</p>
                )}
              </div>

              <ul className="space-y-3 mb-6">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-gray-600">{feature}</span>
                  </li>
                ))}
              </ul>

              <CustomButton
                buttonText={isCurrentPlan ? "Current Plan" : "Select Plan"}
                buttonColor={
                  isCurrentPlan ? "bg-gray-300" :
                  plan.color === "purple" ? "bg-purple-600" :
                  plan.color === "blue" ? "bg-blue-600" :
                  "bg-gray-600"
                }
                textColor={isCurrentPlan ? "text-gray-600" : "text-white"}
                radius="rounded-md"
                onClick={() => !isCurrentPlan && onSelectPlan(plan, selectedBillingCycle)}
                disabled={isCurrentPlan}
                className="w-full"
              />
            </div>
          );
        })}
      </div>

      {/* Feature Comparison Link */}
      <div className="text-center">
        <button className="text-purple-600 hover:text-purple-700 text-sm font-medium">
          Compare all features →
        </button>
      </div>
    </div>
  );
};

export default SubscriptionPlansSelector;