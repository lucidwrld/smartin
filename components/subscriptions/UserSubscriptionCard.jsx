"use client";

import React from "react";
import { Crown, Calendar, Users, Check, X, AlertCircle } from "lucide-react";
import CustomButton from "@/components/Button";

const UserSubscriptionCard = ({ subscription, onUpgrade, onManage }) => {
  const isActive = subscription?.status === "active";
  const daysLeft = subscription?.daysRemaining || 0;
  
  const getStatusColor = () => {
    if (!isActive) return "text-gray-500 bg-gray-50";
    if (daysLeft < 7) return "text-orange-600 bg-orange-50";
    return "text-green-600 bg-green-50";
  };

  const getStatusText = () => {
    if (!isActive) return "Inactive";
    if (daysLeft < 7) return `Expires in ${daysLeft} days`;
    return "Active";
  };

  return (
    <div className="bg-white rounded-lg border p-6 space-y-4">
      <div className="flex justify-between items-start">
        <div className="flex items-center gap-3">
          <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
            subscription?.planName === "Premium" || subscription?.planName === "VIP" 
              ? "bg-purple-100" 
              : "bg-gray-100"
          }`}>
            <Crown className={`w-6 h-6 ${
              subscription?.planName === "Premium" || subscription?.planName === "VIP" 
                ? "text-purple-600" 
                : "text-gray-600"
            }`} />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">{subscription?.planName || "Free Plan"}</h3>
            <p className={`text-sm rounded-full px-3 py-1 inline-block ${getStatusColor()}`}>
              {getStatusText()}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          {subscription?.planName === "Free" && (
            <CustomButton
              buttonText="Upgrade"
              buttonColor="bg-purple-600"
              radius="rounded-md"
              onClick={onUpgrade}
              size="sm"
            />
          )}
          <CustomButton
            buttonText="Manage"
            buttonColor="bg-gray-200"
            textColor="text-gray-700"
            radius="rounded-md"
            onClick={onManage}
            size="sm"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 py-4 border-y">
        <div>
          <p className="text-sm text-gray-600">Events Created</p>
          <p className="text-xl font-semibold">
            {subscription?.eventsUsed || 0}/{subscription?.eventsLimit === "unlimited" ? "∞" : subscription?.eventsLimit || 3}
          </p>
        </div>
        <div>
          <p className="text-sm text-gray-600">Guests per Event</p>
          <p className="text-xl font-semibold">
            {subscription?.guestsLimit === "unlimited" ? "∞" : subscription?.guestsLimit || 50}
          </p>
        </div>
      </div>

      <div>
        <h4 className="text-sm font-medium text-gray-700 mb-2">Plan Features:</h4>
        <ul className="space-y-1">
          {(subscription?.features || ["Basic event creation", "Email invitations", "Standard support"]).map((feature, index) => (
            <li key={index} className="flex items-center gap-2 text-sm text-gray-600">
              <Check className="w-3 h-3 text-green-500" />
              {feature}
            </li>
          ))}
        </ul>
      </div>

      {subscription?.nextBillingDate && (
        <div className="flex items-center gap-2 text-sm text-gray-600 pt-2">
          <Calendar className="w-4 h-4" />
          <span>Next billing: {new Date(subscription.nextBillingDate).toLocaleDateString()}</span>
        </div>
      )}

      {daysLeft < 7 && isActive && (
        <div className="flex items-center gap-2 p-3 bg-orange-50 rounded-lg">
          <AlertCircle className="w-4 h-4 text-orange-600" />
          <p className="text-sm text-orange-800">
            Your subscription expires soon. Renew now to avoid service interruption.
          </p>
        </div>
      )}
    </div>
  );
};

export default UserSubscriptionCard;