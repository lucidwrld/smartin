import InputWithFullBoarder from "../InputWithFullBoarder";
import VoiceRecorder from "../VoiceRecorder";
import { useGetCreditPricingManager } from "@/app/events/controllers/creditManagement/getCreditPricingController";
import useGetUserDetailsManager from "@/app/profile-settings/controllers/get_UserDetails_controller";
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

// Channel configuration with icons and descriptions
const channelConfig = {
  email: {
    icon: Mail,
    title: "Email",
    description: "Send beautiful email invitations",
  },
  sms: {
    icon: MessageSquare,
    title: "SMS",
    description: "Send text message invitations",
  },
  whatsapp: {
    icon: Phone,
    title: "WhatsApp",
    description: "Send via WhatsApp with rich media",
  },
  voice: {
    icon: Volume2,
    title: "Voice Call",
    description: "Automated voice call invitations",
  },
};


export const InvitationSettingsStep = ({ formData, uiState, onFormDataChange, isEditMode, currentSubscription }) => {
  // Get user details for currency
  const { data: userDetails } = useGetUserDetailsManager();
  const currency = userDetails?.data?.user?.currency || "USD";
  const enableInvitations = uiState.enable_invitations || false;
  const enableReminders = uiState.enable_reminders || false;
  const enableThankYou = uiState.enable_thank_you || false;
  const hasActiveSubscription = Boolean(currentSubscription);
  
  // Fetch real pricing data
  const { data: pricingData, isLoading: pricingLoading } = useGetCreditPricingManager();
  
  // Get pricing for a channel and type
  const getChannelPrice = (channel, type) => {
    if (!pricingData?.data) return 0;
    
    // Build the field name based on type, channel, and currency
    const currencyKey = currency === 'NGN' ? 'naira' : 'usd';
    const fieldName = `${type}_${channel}_price_${currencyKey}`;
    
    return pricingData.data[fieldName] || 0;
  };
  
  // Show loading state
  if (pricingLoading) {
    return (
      <div className="space-y-8 w-full max-w-4xl">
        <div className="text-center py-8">
          <div className="text-gray-500">Loading pricing information...</div>
        </div>
      </div>
    );
  }

  const handleInputChange = (field, value) => {
    onFormDataChange(field, value);
  };

  const handleInvitationToggle = (enabled) => {
    handleInputChange("enable_invitations", enabled);
    if (!enabled) {
      // Reset all notification channels when disabled
      handleInputChange("event_invitation.email", false);
      handleInputChange("event_invitation.sms", false);
      handleInputChange("event_invitation.whatsapp", false);
      handleInputChange("event_invitation.voice", false);
      handleInputChange("reminder_notification.email", false);
      handleInputChange("reminder_notification.sms", false);
      handleInputChange("reminder_notification.whatsapp", false);
      handleInputChange("reminder_notification.voice", false);
      handleInputChange("thankyou_notification.email", false);
      handleInputChange("thankyou_notification.sms", false);
      handleInputChange("thankyou_notification.whatsapp", false);
      handleInputChange("thankyou_notification.voice", false);
      handleInputChange("enable_reminders", false);
      handleInputChange("enable_thank_you", false);
      handleInputChange("enable_auto_reminder", false);
      handleInputChange("enable_auto_thank_you", false);
    }
  };

  const handleInvitationChannelToggle = (channel) => {
    const currentValue = formData.event_invitation[channel];
    handleInputChange(`event_invitation.${channel}`, !currentValue);
  };

  const handleReminderToggle = (enabled) => {
    handleInputChange("enable_reminders", enabled);
    handleInputChange("enable_auto_reminder", enabled);
    
    if (!enabled) {
      // Clear all reminder channels when disabled
      handleInputChange("reminder_notification.email", false);
      handleInputChange("reminder_notification.sms", false);
      handleInputChange("reminder_notification.whatsapp", false);
      handleInputChange("reminder_notification.voice", false);
    }
  };

  const handleThankYouToggle = (enabled) => {
    handleInputChange("enable_thank_you", enabled);
    handleInputChange("enable_auto_thank_you", enabled);
    
    if (!enabled) {
      // Clear all thank you channels when disabled
      handleInputChange("thankyou_notification.email", false);
      handleInputChange("thankyou_notification.sms", false);
      handleInputChange("thankyou_notification.whatsapp", false);
      handleInputChange("thankyou_notification.voice", false);
    }
  };

  const calculateInvitationCost = (channel) => {
    const guestCount = parseInt(formData.no_of_invitees) || 0;
    const price = getChannelPrice(channel, 'invitation');
    return price * guestCount;
  };

  const calculateNotificationCost = (channel) => {
    const guestCount = parseInt(formData.no_of_invitees) || 0;
    const price = getChannelPrice(channel, 'notification');
    return price * guestCount;
  };

  const calculateTotalCost = () => {
    // If user has active subscription, notifications are included
    if (hasActiveSubscription) return 0;
    
    let total = 0;
    const guestCount = parseInt(formData.no_of_invitees) || 0;
    
    if (!enableInvitations || guestCount === 0) return 0;
    
    // Calculate invitation costs
    Object.keys(formData.event_invitation || {}).forEach(channel => {
      if (formData.event_invitation[channel]) {
        total += calculateInvitationCost(channel);
      }
    });
    
    // Calculate reminder costs using notification pricing
    if (enableReminders) {
      Object.keys(formData.reminder_notification || {}).forEach(channel => {
        if (formData.reminder_notification[channel]) {
          total += calculateNotificationCost(channel);
        }
      });
    }
    
    // Calculate thank you costs using notification pricing
    if (enableThankYou) {
      Object.keys(formData.thankyou_notification || {}).forEach(channel => {
        if (formData.thankyou_notification[channel]) {
          total += calculateNotificationCost(channel);
        }
      });
    }
    
    return total;
  };

  const hasSelectedChannels = Object.values(formData.event_invitation || {}).some(v => v);

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
                {Object.entries(channelConfig).map(([channelId, config]) => (
                  <InvitationMethodOption
                    key={channelId}
                    icon={config.icon}
                    title={config.title}
                    description={config.description}
                    price={getChannelPrice(channelId, 'invitation')}
                    currency={currency}
                    selected={formData.event_invitation[channelId]}
                    onClick={() => handleInvitationChannelToggle(channelId)}
                  />
                ))}
              </div>

              {!hasSelectedChannels && (
                <p className="text-amber-600 text-sm mt-4">
                  Please select at least one invitation channel.
                </p>
              )}
              
              {/* Voice Recording for Event Invitations */}
              {formData.event_invitation?.voice && (
                <div className="mt-4 p-4 bg-purple-50 rounded-lg border border-purple-200">
                  <h4 className="font-medium text-gray-900 mb-3">Record Event Invitation Voice Message</h4>
                  <VoiceRecorder
                    onRecordingComplete={(audioBlob) => {
                      handleInputChange("voice_recording", audioBlob);
                    }}
                    existingRecording={formData.voice_recording}
                  />
                </div>
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
                      Select reminder channels:
                    </p>
                    <div className="grid grid-cols-2 gap-2">
                      {Object.entries(channelConfig).map(([channelId, config]) => {
                        return (
                          <label key={channelId} className="flex items-center gap-2 text-sm">
                            <input
                              type="checkbox"
                              checked={formData.reminder_notification[channelId]}
                              onChange={(e) => handleInputChange(`reminder_notification.${channelId}`, e.target.checked)}
                              className="rounded text-brandPurple"
                            />
                            <span>{config.title}</span>
                            <span className="text-gray-500">
                              ({currency === "NGN" ? "₦" : "$"}
                              {calculateNotificationCost(channelId).toFixed(2)})
                            </span>
                          </label>
                        );
                      })}
                    </div>
                    
                    {/* Voice Recording for Reminders */}
                    {formData.reminder_notification?.voice && (
                      <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                        <h5 className="font-medium text-gray-900 mb-3">Record Reminder Voice Message</h5>
                        <VoiceRecorder
                          onRecordingComplete={(audioBlob) => {
                            handleInputChange("voice_recording", audioBlob);
                          }}
                          existingRecording={formData.voice_recording}
                        />
                      </div>
                    )}
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
                      Select thank you channels:
                    </p>
                    <div className="grid grid-cols-2 gap-2">
                      {Object.entries(channelConfig).map(([channelId, config]) => {
                        return (
                          <label key={channelId} className="flex items-center gap-2 text-sm">
                            <input
                              type="checkbox"
                              checked={formData.thankyou_notification[channelId]}
                              onChange={(e) => handleInputChange(`thankyou_notification.${channelId}`, e.target.checked)}
                              className="rounded text-brandPurple"
                            />
                            <span>{config.title}</span>
                            <span className="text-gray-500">
                              ({currency === "NGN" ? "₦" : "$"}
                              {calculateNotificationCost(channelId).toFixed(2)})
                            </span>
                          </label>
                        );
                      })}
                    </div>
                    
                    {/* Voice Recording for Thank You Messages */}
                    {formData.thankyou_notification?.voice && (
                      <div className="mt-4 p-4 bg-green-50 rounded-lg border border-green-200">
                        <h5 className="font-medium text-gray-900 mb-3">Record Thank You Voice Message</h5>
                        <VoiceRecorder
                          onRecordingComplete={(audioBlob) => {
                            handleInputChange("voice_recording", audioBlob);
                          }}
                          existingRecording={formData.voice_recording}
                        />
                      </div>
                    )}
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
                      {Object.keys(formData.event_invitation || {})
                        .filter(channel => formData.event_invitation[channel])
                        .reduce((sum, channel) => sum + calculateInvitationCost(channel), 0)
                        .toFixed(2)}
                    </span>
                  </div>
                  
                  {enableReminders && (
                    <div className="flex justify-between">
                      <span>Reminders</span>
                      <span className="font-medium">
                        {currency === "NGN" ? "₦" : "$"}
                        {Object.keys(formData.reminder_notification || {})
                          .filter(channel => formData.reminder_notification[channel])
                          .reduce((sum, channel) => sum + calculateNotificationCost(channel), 0)
                          .toFixed(2)}
                      </span>
                    </div>
                  )}
                  
                  {enableThankYou && (
                    <div className="flex justify-between">
                      <span>Thank You Messages</span>
                      <span className="font-medium">
                        {currency === "NGN" ? "₦" : "$"}
                        {Object.keys(formData.thankyou_notification || {})
                          .filter(channel => formData.thankyou_notification[channel])
                          .reduce((sum, channel) => sum + calculateNotificationCost(channel), 0)
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