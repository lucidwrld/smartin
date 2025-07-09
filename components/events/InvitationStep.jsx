import InputWithFullBoarder from "../InputWithFullBoarder";
import VoiceRecorder from "../VoiceRecorder";
import {
  KeySquare,
  Scan,
  Mail,
  MessageSquare,
  Phone,
  Volume2,
} from "lucide-react";

const VerificationOption = ({
  icon: Icon,
  title,
  description,
  selected,
  onClick,
}) => (
  <button
    onClick={onClick}
    className={`flex items-start p-6 rounded-xl border transition-all
      ${
        selected
          ? "border-brandPurple bg-purple-50"
          : "border-gray-200 hover:border-gray-300"
      }`}
  >
    <div className="flex gap-4">
      <div className="mt-1">
        <Icon
          size={24}
          className={selected ? "text-brandPurple" : "text-gray-700"}
        />
      </div>
      <div className="text-left">
        <h3 className="font-medium text-gray-900 mb-1">{title}</h3>
        <p className="text-gray-600 text-sm">{description}</p>
      </div>
    </div>
    <div className="ml-auto">
      <div
        className={`w-5 h-5 rounded-full border-2 flex items-center justify-center
          ${
            selected ? "border-brandPurple bg-brandPurple" : "border-gray-300"
          }`}
      >
        {selected && <div className="w-2 h-2 rounded-full bg-white" />}
      </div>
    </div>
  </button>
);

const InvitationMethodOption = ({
  icon: Icon,
  title,
  description,
  price,
  currency,
  selected,
  onClick,
  disabled = false,
}) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className={`flex items-start p-4 rounded-lg border transition-all ${
      disabled
        ? "opacity-50 cursor-not-allowed border-gray-200 bg-gray-50"
        : selected
        ? "border-brandPurple bg-purple-50"
        : "border-gray-200 hover:border-gray-300"
    }`}
  >
    <div className="flex gap-3 flex-1">
      <div className="mt-1">
        <Icon
          size={20}
          className={
            disabled
              ? "text-gray-400"
              : selected
              ? "text-brandPurple"
              : "text-gray-700"
          }
        />
      </div>
      <div className="text-left flex-1">
        <h4 className="font-medium text-gray-900 mb-1">{title}</h4>
        <p className="text-gray-600 text-sm mb-1">{description}</p>
        <p className="text-xs text-gray-500">
          {currency === "NGN" ? "₦" : "$"}
          {price} per invitation
        </p>
      </div>
    </div>
    <div className="ml-2">
      <div
        className={`w-4 h-4 rounded border-2 flex items-center justify-center
          ${
            disabled
              ? "border-gray-300 bg-gray-100"
              : selected
              ? "border-brandPurple bg-brandPurple"
              : "border-gray-300"
          }`}
      >
        {selected && <div className="w-2 h-2 rounded-sm bg-white" />}
      </div>
    </div>
  </button>
);

const verificationOptions = [
  {
    id: "accessCode",
    icon: KeySquare,
    title: "Access Code",
    description: "Guests will receive a unique code to enter at the event.",
  },
  {
    id: "facial",
    icon: Scan,
    title: "Facial Recognition",
    description: "Guests will verify their identity using facial recognition.",
  },
];

// Mock invitation pricing data
const invitationMethods = [
  {
    id: "email",
    icon: Mail,
    title: "Email",
    description: "Send beautiful email invitations",
    priceNGN: 25,
    priceUSD: 0.05,
  },
  {
    id: "sms",
    icon: MessageSquare,
    title: "SMS",
    description: "Send text message invitations",
    priceNGN: 45,
    priceUSD: 0.08,
  },
  {
    id: "whatsapp",
    icon: Phone,
    title: "WhatsApp",
    description: "Send via WhatsApp with rich media",
    priceNGN: 35,
    priceUSD: 0.06,
  },
  {
    id: "voice",
    icon: Volume2,
    title: "Voice Call",
    description: "Automated voice call invitations",
    priceNGN: 150,
    priceUSD: 0.25,
  },
];

// Notification pricing (50% of invitation cost for reminders, 75% for thank you)
const REMINDER_MULTIPLIER = 0.5;
const THANK_YOU_MULTIPLIER = 0.75;

export const InvitationSettingsStep = ({ formData, uiState, onFormDataChange, isEditMode }) => {
  const currency = formData.currency || "USD";
  const enableInvitations = uiState.enable_invitations || false;
  const enableReminders = uiState.enable_reminders || false;
  const enableThankYou = uiState.enable_thank_you || false;

  const handleInputChange = (field, value) => {
    onFormDataChange(field, value);
  };

  const handleInvitationToggle = (enabled) => {
    handleInputChange("enable_invitations", enabled);
    if (!enabled) {
      // Reset all notification channels when disabled
      handleInputChange("event_notifications.email", false);
      handleInputChange("event_notifications.sms", false);
      handleInputChange("event_notifications.whatsapp", false);
      handleInputChange("event_notifications.voice", false);
      handleInputChange("reminder_notifications.email", false);
      handleInputChange("reminder_notifications.sms", false);
      handleInputChange("reminder_notifications.whatsapp", false);
      handleInputChange("reminder_notifications.voice", false);
      handleInputChange("thank_you_notifications.email", false);
      handleInputChange("thank_you_notifications.sms", false);
      handleInputChange("thank_you_notifications.whatsapp", false);
      handleInputChange("thank_you_notifications.voice", false);
      handleInputChange("enable_reminders", false);
      handleInputChange("enable_thank_you", false);
      handleInputChange("enable_auto_reminder", false);
      handleInputChange("enable_auto_thank_you", false);
    }
  };

  const handleInvitationChannelToggle = (channel) => {
    const currentValue = formData.event_notifications[channel];
    handleInputChange(`event_notifications.${channel}`, !currentValue);
  };

  const handleReminderToggle = (enabled) => {
    handleInputChange("enable_reminders", enabled);
    handleInputChange("enable_auto_reminder", enabled);
    
    if (!enabled) {
      // Clear all reminder channels when disabled
      handleInputChange("reminder_notifications.email", false);
      handleInputChange("reminder_notifications.sms", false);
      handleInputChange("reminder_notifications.whatsapp", false);
      handleInputChange("reminder_notifications.voice", false);
    }
  };

  const handleThankYouToggle = (enabled) => {
    handleInputChange("enable_thank_you", enabled);
    handleInputChange("enable_auto_thank_you", enabled);
    
    if (!enabled) {
      // Clear all thank you channels when disabled
      handleInputChange("thank_you_notifications.email", false);
      handleInputChange("thank_you_notifications.sms", false);
      handleInputChange("thank_you_notifications.whatsapp", false);
      handleInputChange("thank_you_notifications.voice", false);
    }
  };

  const calculateChannelCost = (channel, multiplier = 1) => {
    const method = invitationMethods.find(m => m.id === channel);
    if (!method) return 0;
    
    const guestCount = parseInt(formData.no_of_invitees) || 0;
    const price = currency === "NGN" ? method.priceNGN : method.priceUSD;
    return price * guestCount * multiplier;
  };

  const calculateTotalCost = () => {
    let total = 0;
    const guestCount = parseInt(formData.no_of_invitees) || 0;
    
    if (!enableInvitations || guestCount === 0) return 0;
    
    // Calculate invitation costs
    Object.keys(formData.event_notifications).forEach(channel => {
      if (formData.event_notifications[channel]) {
        total += calculateChannelCost(channel);
      }
    });
    
    // Calculate reminder costs (50% of base cost)
    if (enableReminders) {
      Object.keys(formData.reminder_notifications).forEach(channel => {
        if (formData.reminder_notifications[channel]) {
          total += calculateChannelCost(channel, REMINDER_MULTIPLIER);
        }
      });
    }
    
    // Calculate thank you costs (75% of base cost)
    if (enableThankYou) {
      Object.keys(formData.thank_you_notifications).forEach(channel => {
        if (formData.thank_you_notifications[channel]) {
          total += calculateChannelCost(channel, THANK_YOU_MULTIPLIER);
        }
      });
    }
    
    return total;
  };

  const hasSelectedChannels = Object.values(formData.event_notifications).some(v => v);

  return (
    <div className="space-y-8 w-full max-w-4xl">
      {/* Host Information */}
      <div className="space-y-4">
        <InputWithFullBoarder
          label="Host Names"
          id="host"
          isRequired={true}
          value={formData.host}
          onChange={(e) => handleInputChange("host", e.target.value)}
          placeholder="Enter the host names"
        />
      </div>

      {/* Access Type Selection */}
      <div className="w-full">
        <h2 className="text-2xl font-semibold mb-2">Choose Access Type</h2>
        <p className="text-gray-600 mb-6">
          Choose a method to verify your guest before entry.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          {verificationOptions.map((option) => (
            <VerificationOption
              key={option.id}
              icon={option.icon}
              title={option.title}
              description={option.description}
              selected={formData.verification_type === option.id}
              onClick={() => handleInputChange("verification_type", option.id)}
            />
          ))}
        </div>
      </div>

      {/* Event Invitations Section - Only show in create mode */}
      {!isEditMode && (
        <div className="border-t pt-8">
          <div className="mb-6">
            <h2 className="text-2xl font-semibold mb-2">Event Invitations</h2>
            <p className="text-gray-600">
              Choose whether to send digital invitations and select your preferred
              channels. Additional charges apply.
            </p>
          </div>

        {/* Enable Invitations Toggle */}
        <div className="mb-6 p-6 bg-blue-50 rounded-lg">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h3 className="font-medium text-gray-900 mb-2">
                Enable Event Invitations
              </h3>
              <p className="text-sm text-gray-600">
                Send digital invitations to your guests. If disabled, you'll need to invite guests manually.
              </p>
            </div>

            <div className="ml-4">
              <button
                onClick={() => handleInvitationToggle(!enableInvitations)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-brandPurple focus:ring-offset-2 ${
                  enableInvitations ? "bg-brandPurple" : "bg-gray-200"
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    enableInvitations ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </button>
            </div>
          </div>
        </div>

        {/* Invitation Methods and Cost Breakdown */}
        {enableInvitations && (
          <div className="space-y-6">
            {/* Invitation Channels */}
            <div className="bg-white p-6 rounded-lg border">
              <h3 className="font-medium text-gray-900 mb-4">
                Invitation Channels
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                Select channels for sending invitations to {formData.no_of_invitees || 0} guests
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {invitationMethods.map((method) => (
                  <InvitationMethodOption
                    key={method.id}
                    icon={method.icon}
                    title={method.title}
                    description={method.description}
                    price={
                      currency === "NGN" ? method.priceNGN : method.priceUSD
                    }
                    currency={currency}
                    selected={formData.event_notifications[method.id]}
                    onClick={() => handleInvitationChannelToggle(method.id)}
                  />
                ))}
              </div>

              {!hasSelectedChannels && (
                <p className="text-amber-600 text-sm mt-4">
                  Please select at least one invitation channel.
                </p>
              )}
            </div>

            {/* Additional Notification Options */}
            <div className="space-y-4">
              <h3 className="font-medium text-gray-900">
                Additional Notifications
              </h3>
              
              {/* Reminder Messages */}
              <div className="bg-white p-6 rounded-lg border">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900 mb-1">
                      Reminder Messages
                    </h4>
                    <p className="text-sm text-gray-600">
                      Send automatic reminders 24 hours before the event
                    </p>
                  </div>

                  <div className="ml-4">
                    <button
                      onClick={() => handleReminderToggle(!enableReminders)}
                      disabled={!enableInvitations}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-brandPurple focus:ring-offset-2 ${
                        enableReminders ? "bg-brandPurple" : "bg-gray-200"
                      } ${
                        !enableInvitations
                          ? "opacity-50 cursor-not-allowed"
                          : ""
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          enableReminders ? "translate-x-6" : "translate-x-1"
                        }`}
                      />
                    </button>
                  </div>
                </div>
                
                {enableReminders && (
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-600 mb-2">
                      Select reminder channels (50% of invitation cost):
                    </p>
                    <div className="grid grid-cols-2 gap-2">
                      {invitationMethods.map(method => {
                        return (
                          <label key={method.id} className="flex items-center gap-2 text-sm">
                            <input
                              type="checkbox"
                              checked={formData.reminder_notifications[method.id]}
                              onChange={(e) => handleInputChange(`reminder_notifications.${method.id}`, e.target.checked)}
                              className="rounded text-brandPurple"
                            />
                            <span>{method.title}</span>
                            <span className="text-gray-500">
                              ({currency === "NGN" ? "₦" : "$"}
                              {calculateChannelCost(method.id, REMINDER_MULTIPLIER).toFixed(2)})
                            </span>
                          </label>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>

              {/* Thank You Messages */}
              <div className="bg-white p-6 rounded-lg border">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900 mb-1">
                      Thank You Messages
                    </h4>
                    <p className="text-sm text-gray-600">
                      Send thank you messages to guests after the event
                    </p>
                  </div>

                  <div className="ml-4">
                    <button
                      onClick={() => handleThankYouToggle(!enableThankYou)}
                      disabled={!enableInvitations}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-brandPurple focus:ring-offset-2 ${
                        enableThankYou ? "bg-brandPurple" : "bg-gray-200"
                      } ${
                        !enableInvitations
                          ? "opacity-50 cursor-not-allowed"
                          : ""
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          enableThankYou ? "translate-x-6" : "translate-x-1"
                        }`}
                      />
                    </button>
                  </div>
                </div>
                
                {enableThankYou && (
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-600 mb-2">
                      Select thank you channels (75% of invitation cost):
                    </p>
                    <div className="grid grid-cols-2 gap-2">
                      {invitationMethods.map(method => {
                        return (
                          <label key={method.id} className="flex items-center gap-2 text-sm">
                            <input
                              type="checkbox"
                              checked={formData.thank_you_notifications[method.id]}
                              onChange={(e) => handleInputChange(`thank_you_notifications.${method.id}`, e.target.checked)}
                              className="rounded text-brandPurple"
                            />
                            <span>{method.title}</span>
                            <span className="text-gray-500">
                              ({currency === "NGN" ? "₦" : "$"}
                              {calculateChannelCost(method.id, THANK_YOU_MULTIPLIER).toFixed(2)})
                            </span>
                          </label>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Cost Summary */}
            {hasSelectedChannels && (
              <div className="bg-purple-50 p-6 rounded-lg border border-purple-200">
                <h3 className="font-medium text-gray-900 mb-4">
                  Notification Cost Summary
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Invitations ({formData.no_of_invitees || 0} guests)</span>
                    <span className="font-medium">
                      {currency === "NGN" ? "₦" : "$"}
                      {Object.keys(formData.event_notifications)
                        .filter(channel => formData.event_notifications[channel])
                        .reduce((sum, channel) => sum + calculateChannelCost(channel), 0)
                        .toFixed(2)}
                    </span>
                  </div>
                  
                  {enableReminders && (
                    <div className="flex justify-between">
                      <span>Reminders (50% of invitation cost)</span>
                      <span className="font-medium">
                        {currency === "NGN" ? "₦" : "$"}
                        {Object.keys(formData.reminder_notifications)
                          .filter(channel => formData.reminder_notifications[channel])
                          .reduce((sum, channel) => sum + calculateChannelCost(channel, REMINDER_MULTIPLIER), 0)
                          .toFixed(2)}
                      </span>
                    </div>
                  )}
                  
                  {enableThankYou && (
                    <div className="flex justify-between">
                      <span>Thank You Messages (75% of invitation cost)</span>
                      <span className="font-medium">
                        {currency === "NGN" ? "₦" : "$"}
                        {Object.keys(formData.thank_you_notifications)
                          .filter(channel => formData.thank_you_notifications[channel])
                          .reduce((sum, channel) => sum + calculateChannelCost(channel, THANK_YOU_MULTIPLIER), 0)
                          .toFixed(2)}
                      </span>
                    </div>
                  )}
                  
                  <div className="border-t pt-2 mt-2">
                    <div className="flex justify-between font-medium text-lg">
                      <span>Total Notification Cost</span>
                      <span className="text-brandPurple">
                        {currency === "NGN" ? "₦" : "$"}
                        {calculateTotalCost().toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

          {/* Information Note */}
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600 mb-2">
              <strong>Note:</strong> Notification costs are separate from your event creation fee and will be added to your total payment.
            </p>
            <p className="text-sm text-gray-600">
              You can purchase additional credits anytime from your event dashboard to send more notifications.
            </p>
          </div>
        </div>
      )}

    </div>
  );
};