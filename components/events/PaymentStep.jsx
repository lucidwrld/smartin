import React from "react";
import {
  ArrowUpRight,
  Building2,
  Clock,
  AlertCircle,
  Copy,
  Crown,
  CreditCard,
  Check,
  X,
} from "lucide-react";
import useGetDiscountsManager from "@/app/admin/settings/controllers/getDiscountsController";
import useGetPricingsManager from "@/app/admin/settings/controllers/getPricingController";
import useGetUserDetailsManager from "@/app/profile-settings/controllers/get_UserDetails_controller";
import { calculateTotal } from "@/utils/calculateTotal";
import {
  mockUserSubscription,
  subscriptionPlans,
  canUseSubscription,
  calculateInvitationCosts,
  canUseInvitationsWithSubscription,
} from "@/utils/mockSubscriptionData";

const PAYMENT_METHODS = [
  {
    id: "online",
    icon: ArrowUpRight,
    title: "Pay Online Now",
    description: "Pay using gateway.",
  },
  {
    id: "bank",
    icon: Building2,
    title: "Pay With Bank Transfer",
    description: "Pay to the given account.",
  },
  {
    id: "later",
    icon: Clock,
    title: "Pay Later",
    description: "Event inactive until payment.",
  },
];

const PaymentOption = ({ method, selected, onClick }) => (
  <button
    onClick={() => onClick(method.id)}
    className={`flex items-start p-6 rounded-xl border transition-all
      ${
        selected
          ? "border-brandPurple bg-blue-50"
          : "border-gray-200 hover:border-gray-300"
      }`}
  >
    <div className="flex-1">
      <div className="flex items-start gap-4 mb-2">
        <method.icon size={20} className="mt-1" />
        <div className="flex-1">
          <h4 className="font-medium text-gray-900">{method.title}</h4>
          <p className="text-gray-600 text-sm">{method.description}</p>
        </div>
      </div>
    </div>
    <div
      className={`w-5 h-5 rounded-full border-2 flex items-center justify-center
      ${selected ? "border-brandPurple bg-brandPurple" : "border-gray-300"}`}
    >
      {selected && <div className="w-2 h-2 rounded-full bg-white" />}
    </div>
  </button>
);

const SubscriptionOption = ({
  selected,
  onClick,
  plan,
  userPlan,
  canUse,
  reasons,
}) => (
  <div
    className={`border rounded-xl p-6 transition-all cursor-pointer ${
      selected
        ? "border-brandPurple bg-purple-50"
        : canUse
        ? "border-gray-200 hover:border-gray-300"
        : "border-red-200 bg-red-50"
    } ${!canUse ? "opacity-75" : ""}`}
    onClick={() => canUse && onClick()}
  >
    <div className="flex items-start justify-between mb-4">
      <div className="flex items-center gap-3">
        <div
          className={`p-2 rounded-lg ${
            canUse ? "bg-purple-100" : "bg-red-100"
          }`}
        >
          <Crown
            className={`h-5 w-5 ${canUse ? "text-purple-600" : "text-red-600"}`}
          />
        </div>
        <div>
          <h3 className="font-medium text-gray-900">Use Subscription</h3>
          <p className="text-sm text-gray-600">
            {userPlan.name} - {canUse ? "Available" : "Limit Exceeded"}
          </p>
        </div>
      </div>
      <div
        className={`w-5 h-5 rounded-full border-2 flex items-center justify-center
        ${selected ? "border-brandPurple bg-brandPurple" : "border-gray-300"}`}
      >
        {selected && <div className="w-2 h-2 rounded-full bg-white" />}
      </div>
    </div>

    {canUse ? (
      <div className="space-y-2">
        <div className="flex items-center gap-2 text-sm text-green-600">
          <Check className="h-4 w-4" />
          <span>Event creation included</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-green-600">
          <Check className="h-4 w-4" />
          <span>
            {plan.limits.guestsPerEvent === 999999
              ? "Unlimited"
              : plan.limits.guestsPerEvent}{" "}
            guests allowed
          </span>
        </div>
        {plan.limits.invitationsPerMonth > 0 && (
          <div className="flex items-center gap-2 text-sm text-green-600">
            <Check className="h-4 w-4" />
            <span>
              {plan.limits.invitationsPerMonth === 999999
                ? "Unlimited"
                : plan.limits.invitationsPerMonth}{" "}
              invitations included
            </span>
          </div>
        )}
      </div>
    ) : (
      <div className="space-y-2">
        {reasons.map((reason, index) => (
          <div
            key={index}
            className="flex items-center gap-2 text-sm text-red-600"
          >
            <X className="h-4 w-4" />
            <span>{reason}</span>
          </div>
        ))}
      </div>
    )}
  </div>
);

const PayPerEventOption = ({
  selected,
  onClick,
  eventCost,
  invitationCost,
  currency,
}) => (
  <div
    className={`border rounded-xl p-6 transition-all cursor-pointer ${
      selected
        ? "border-brandPurple bg-purple-50"
        : "border-gray-200 hover:border-gray-300"
    }`}
    onClick={onClick}
  >
    <div className="flex items-start justify-between mb-4">
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-lg bg-blue-100">
          <CreditCard className="h-5 w-5 text-blue-600" />
        </div>
        <div>
          <h3 className="font-medium text-gray-900">Pay Per Event</h3>
          <p className="text-sm text-gray-600">
            One-time payment for this event
          </p>
        </div>
      </div>
      <div
        className={`w-5 h-5 rounded-full border-2 flex items-center justify-center
        ${selected ? "border-brandPurple bg-brandPurple" : "border-gray-300"}`}
      >
        {selected && <div className="w-2 h-2 rounded-full bg-white" />}
      </div>
    </div>

    <div className="space-y-3">
      <div className="flex justify-between items-center text-sm">
        <span className="text-gray-600">Event creation</span>
        <span className="font-medium">
          {currency === "NGN" ? "₦" : "$"}
          {eventCost.toFixed(2)}
        </span>
      </div>
      {invitationCost > 0 && (
        <div className="flex justify-between items-center text-sm">
          <span className="text-gray-600">Invitations</span>
          <span className="font-medium">
            {currency === "NGN" ? "₦" : "$"}
            {invitationCost.toFixed(2)}
          </span>
        </div>
      )}
      <div className="border-t pt-3 flex justify-between items-center">
        <span className="font-medium">Total</span>
        <span className="font-semibold text-lg text-brandPurple">
          {currency === "NGN" ? "₦" : "$"}
          {(eventCost + invitationCost).toFixed(2)}
        </span>
      </div>
    </div>
  </div>
);

const SummaryItem = ({ label, value, className = "" }) => (
  <div className={`flex justify-between items-center py-2 ${className}`}>
    <span className="text-gray-900">{label}</span>
    <span className="text-gray-900 font-medium">{value}</span>
  </div>
);

const BankDetails = ({ onCopy }) => (
  <div className="mt-6 space-y-4 bg-whiteColor p-6 rounded-lg">
    <div>
      <h4 className="text-gray-700 text-sm mb-1">Bank</h4>
      <p className="text-gray-900 font-medium">Sterling bank</p>
    </div>
    <div>
      <h4 className="text-gray-700 text-sm mb-1">Account Number</h4>
      <div className="flex items-center justify-between">
        <p className="text-gray-900 font-medium">2345678905</p>
        <button
          onClick={() => onCopy("2345678905")}
          className="text-purple-600 flex items-center gap-1 text-sm hover:text-purple-700"
        >
          Copy
          <Copy size={16} />
        </button>
      </div>
    </div>
  </div>
);

const PaymentStep = ({
  formData,
  onFormDataChange,
  isEditMode = false,
  event,
  currency,
}) => {
  const handleCopyClick = (text) => navigator.clipboard.writeText(text);
  const { data: discounts, isLoading: loadingDiscounts } =
    useGetDiscountsManager();
  const { data: pricing, isLoading } = useGetPricingsManager();
  const { data: userDetails } = useGetUserDetailsManager();

  const isPartner = userDetails?.data?.user?.isPartner;
  const noOfGuests = parseInt(formData.no_of_invitees) || 0;

  // Get invitation settings
  const enableInvitations = formData.enable_invitations || false;
  const invitationMethods = formData.invitation_methods || [];
  const enableReminders = formData.enable_reminders || false;

  // Get current subscription info
  const userSubscription = mockUserSubscription;
  const currentPlan = subscriptionPlans[userSubscription.plan];

  // Calculate costs
  const priceCalculation =
    pricing?.data && discounts?.data
      ? calculateTotal(
          noOfGuests,
          pricing.data,
          discounts.data,
          isPartner,
          currency
        )
      : { total: 0, eventPrice: 0 };

  const invitationCost = enableInvitations
    ? calculateInvitationCosts(
        invitationMethods,
        noOfGuests,
        enableReminders,
        currency
      )
    : 0;

  // Check subscription eligibility
  const canUseSubscriptionForEvent = canUseSubscription(
    userSubscription,
    formData
  );
  const canUseSubscriptionForInvitations = canUseInvitationsWithSubscription(
    userSubscription,
    invitationCost,
    currency
  );

  // Determine subscription availability reasons
  const subscriptionReasons = [];
  if (
    userSubscription.usage.eventsThisMonth >=
    userSubscription.limits.eventsPerMonth
  ) {
    subscriptionReasons.push(
      `Monthly event limit reached (${userSubscription.limits.eventsPerMonth})`
    );
  }
  if (
    userSubscription.usage.guestsThisMonth + noOfGuests >
    userSubscription.limits.guestsPerEvent
  ) {
    subscriptionReasons.push(
      `Guest limit exceeded (${userSubscription.limits.guestsPerEvent} max)`
    );
  }
  if (enableInvitations && !canUseSubscriptionForInvitations) {
    subscriptionReasons.push(
      "Invitation limit exceeded - additional charges apply"
    );
  }

  const canUseSubscriptionFully =
    canUseSubscriptionForEvent &&
    (!enableInvitations || canUseSubscriptionForInvitations);

  const formatCurrency = (amount) => {
    return `${amount.toLocaleString()} ${currency}`;
  };

  if (isLoading || loadingDiscounts) {
    return <div>Loading...</div>;
  }

  return (
    <div className="md:w-full mx-auto max-w-[95%] md:max-w-[70%]">
      <h2 className="text-xl font-semibold mb-6">Payment Options</h2>

      {/* Billing Method Selection */}
      <div className="mb-8">
        <h3 className="text-lg font-medium mb-4">Choose Billing Method</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <SubscriptionOption
            selected={formData.payment_mode === "subscription"}
            onClick={() => onFormDataChange("payment_mode", "subscription")}
            plan={currentPlan}
            userPlan={currentPlan}
            canUse={canUseSubscriptionFully}
            reasons={subscriptionReasons}
          />

          <PayPerEventOption
            selected={formData.payment_mode !== "subscription"}
            onClick={() => onFormDataChange("payment_mode", "pay_per_event")}
            eventCost={priceCalculation?.total || 0}
            invitationCost={invitationCost}
            currency={currency}
          />
        </div>
      </div>

      {/* Payment Summary */}
      <div className="space-y-4 mb-8 bg-whiteColor p-2 md:p-6 rounded-lg">
        <h3 className="text-lg font-medium mb-4">Payment Summary</h3>

        {formData.payment_mode === "subscription" && canUseSubscriptionFully ? (
          // Subscription Summary
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-green-600 mb-4">
              <Crown className="h-5 w-5" />
              <span className="font-medium">Using {currentPlan.name}</span>
            </div>

            <SummaryItem
              label="Event Creation"
              value="Included in subscription"
              className="text-green-600"
            />

            {enableInvitations && canUseSubscriptionForInvitations ? (
              <SummaryItem
                label={`Invitations (${invitationMethods.length} methods)`}
                value="Included in subscription"
                className="text-green-600"
              />
            ) : enableInvitations ? (
              <>
                <SummaryItem
                  label={`Invitations (${invitationMethods.length} methods)`}
                  value={formatCurrency(invitationCost)}
                />
                <SummaryItem
                  label="Total Additional Cost"
                  value={formatCurrency(invitationCost)}
                  className="border-t pt-3 text-lg font-semibold"
                />
              </>
            ) : null}

            {(!enableInvitations || canUseSubscriptionForInvitations) && (
              <SummaryItem
                label="Total Cost"
                value="$0.00 (Covered by subscription)"
                className="border-t pt-3 text-lg font-semibold text-green-600"
              />
            )}
          </div>
        ) : (
          // Pay Per Event Summary
          <div className="space-y-3">
            <SummaryItem
              label="Event Base Price"
              value={formatCurrency(priceCalculation?.eventPrice || 0)}
            />
            <SummaryItem
              label="Price per Guest"
              value={formatCurrency(priceCalculation?.pricePerInvite || 0)}
            />
            <SummaryItem
              label={`Guest Total (${noOfGuests} guests)`}
              value={formatCurrency(
                (priceCalculation?.pricePerInvite || 0) * noOfGuests
              )}
            />

            {enableInvitations && invitationCost > 0 && (
              <>
                <SummaryItem
                  label={`Invitations (${invitationMethods.length} methods)`}
                  value={formatCurrency(invitationCost)}
                />
                {enableReminders && (
                  <div className="text-sm text-gray-600 ml-4">
                    • Includes reminder messages (+50%)
                  </div>
                )}
              </>
            )}

            <SummaryItem
              label="Subtotal"
              value={formatCurrency(
                (priceCalculation?.subtotal || 0) + invitationCost
              )}
              className="border-t pt-3"
            />

            {priceCalculation?.discountPercent > 0 && (
              <>
                <div className="bg-green-50 p-3 rounded-lg">
                  <p className="text-green-700 text-sm font-medium">
                    {isPartner
                      ? "Partner Discount Applied!"
                      : "Volume Discount Applied!"}
                  </p>
                  <p className="text-green-600 text-sm mt-1">
                    {priceCalculation.discountPercent}% off for {noOfGuests}{" "}
                    guests
                  </p>
                </div>
                <SummaryItem
                  label="Discount"
                  value={`-${formatCurrency(priceCalculation.discountAmount)}`}
                  className="text-green-600"
                />
              </>
            )}

            <SummaryItem
              label="Total"
              value={formatCurrency(
                (priceCalculation?.total || 0) + invitationCost
              )}
              className="border-t pt-3 text-lg font-semibold"
            />
          </div>
        )}
      </div>

      {/* Payment Method Selection (only if payment required) */}
      {(formData.payment_mode !== "subscription" ||
        !canUseSubscriptionFully) && (
        <>
          {(!isEditMode || !event?.isPaid) && (
            <div className="flex p-4 mb-8 bg-red-50 border border-red-100 rounded-lg">
              <AlertCircle className="h-5 w-5 text-red-500 mt-0.5" />
              <div className="ml-3">
                <h3 className="text-red-500 font-medium">
                  Event Is Not Active
                </h3>
                <p className="text-gray-600 mt-1">
                  Payment is needed to activate the event
                </p>
              </div>
            </div>
          )}

          <div className="space-y-4">
            <h3 className="text-gray-900">Select payment method</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {PAYMENT_METHODS.map((method) =>
                method.id === "bank" ? (
                  currency === "NGN" && (
                    <PaymentOption
                      key={method.id}
                      method={method}
                      selected={formData.payment_type === method.id}
                      onClick={(id) => onFormDataChange("payment_type", id)}
                    />
                  )
                ) : (
                  <PaymentOption
                    key={method.id}
                    method={method}
                    selected={formData.payment_type === method.id}
                    onClick={(id) => onFormDataChange("payment_type", id)}
                  />
                )
              )}
            </div>
          </div>
        </>
      )}

      {/* Bank Details (if bank transfer selected) */}
      {formData.payment_type === "bank" && currency === "NGN" && (
        <BankDetails onCopy={handleCopyClick} />
      )}
    </div>
  );
};

export default PaymentStep;
