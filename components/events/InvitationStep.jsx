import InputWithFullBoarder from "../InputWithFullBoarder";
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
    title: "Email Invitation",
    description: "Send beautiful email invitations",
    priceNGN: 25,
    priceUSD: 0.05,
  },
  {
    id: "sms",
    icon: MessageSquare,
    title: "SMS Invitation",
    description: "Send text message invitations",
    priceNGN: 45,
    priceUSD: 0.08,
  },
  {
    id: "whatsapp",
    icon: Phone,
    title: "WhatsApp Invitation",
    description: "Send via WhatsApp with rich media",
    priceNGN: 35,
    priceUSD: 0.06,
  },
  {
    id: "voice",
    icon: Volume2,
    title: "Voice Call Invitation",
    description: "Automated voice call invitations",
    priceNGN: 150,
    priceUSD: 0.25,
  },
];

export const InvitationSettingsStep = ({ formData, onFormDataChange }) => {
  const currency = formData.currency || "USD";
  const selectedMethods = formData.invitation_methods || [];
  const enableInvitations = formData.enable_invitations || false;
  const enableReminders = formData.enable_reminders || false;

  const handleInputChange = (field, value) => {
    onFormDataChange(field, value);
  };

  const handleInvitationToggle = (enabled) => {
    handleInputChange("enable_invitations", enabled);
    if (!enabled) {
      // Clear invitation methods when disabled
      handleInputChange("invitation_methods", []);
      handleInputChange("enable_reminders", false);
    }
  };

  const handleMethodToggle = (methodId) => {
    const currentMethods = selectedMethods || [];
    const isSelected = currentMethods.includes(methodId);

    let newMethods;
    if (isSelected) {
      newMethods = currentMethods.filter((id) => id !== methodId);
    } else {
      newMethods = [...currentMethods, methodId];
    }

    handleInputChange("invitation_methods", newMethods);
  };

  const calculateInvitationCost = () => {
    if (!enableInvitations || !selectedMethods.length) return 0;

    const guestCount = parseInt(formData.no_of_invitees) || 0;
    let totalCost = 0;

    selectedMethods.forEach((methodId) => {
      const method = invitationMethods.find((m) => m.id === methodId);
      if (method) {
        const price = currency === "NGN" ? method.priceNGN : method.priceUSD;
        totalCost += price * guestCount;
      }
    });

    // Add reminder cost (50% of invitation cost)
    if (enableReminders) {
      totalCost = totalCost * 1.5;
    }

    return totalCost;
  };

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

      {/* Event Invitations Section */}
      <div className="border-t pt-8">
        <div className="mb-6">
          <h2 className="text-2xl font-semibold mb-2">Event Invitations</h2>
          <p className="text-gray-600">
            Choose whether to send digital invitations and select your preferred
            methods.
          </p>
        </div>

        {/* Enable Invitations Toggle */}
        <div className="mb-6 p-6 bg-blue-50 rounded-lg">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h3 className="font-medium text-gray-900 mb-2">
                Enable Event Invitations
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                Send digital invitations to your guests through multiple
                channels. If disabled, guests will need to be informed about the
                event through other means.
              </p>

              {enableInvitations && (
                <div className="bg-white p-4 rounded-lg border">
                  <h4 className="font-medium text-gray-900 mb-2">
                    Cost Estimate
                  </h4>
                  <div className="text-sm text-gray-600 space-y-1">
                    <p>Guests: {formData.no_of_invitees || 0}</p>
                    <p>Selected methods: {selectedMethods.length}</p>
                    <p>Reminders: {enableReminders ? "Enabled" : "Disabled"}</p>
                    <p className="font-medium text-lg text-brandPurple">
                      Total: {currency === "NGN" ? "₦" : "$"}
                      {calculateInvitationCost().toFixed(2)}
                    </p>
                  </div>
                </div>
              )}
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

        {/* Invitation Methods */}
        {enableInvitations && (
          <div className="space-y-6">
            <div>
              <h3 className="font-medium text-gray-900 mb-4">
                Select Invitation Methods
              </h3>
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
                    selected={selectedMethods.includes(method.id)}
                    onClick={() => handleMethodToggle(method.id)}
                  />
                ))}
              </div>

              {selectedMethods.length === 0 && (
                <p className="text-amber-600 text-sm mt-4">
                  Please select at least one invitation method.
                </p>
              )}
            </div>

            {/* Reminder Options */}
            <div className="border-t pt-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="font-medium text-gray-900 mb-2">
                    Enable Reminder Messages
                  </h3>
                  <p className="text-sm text-gray-600">
                    Send automatic reminder messages 24 hours before the event.
                    This adds 50% to your invitation costs.
                  </p>
                </div>

                <div className="ml-4">
                  <button
                    onClick={() =>
                      handleInputChange("enable_reminders", !enableReminders)
                    }
                    disabled={
                      !enableInvitations || selectedMethods.length === 0
                    }
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-brandPurple focus:ring-offset-2 ${
                      enableReminders ? "bg-brandPurple" : "bg-gray-200"
                    } ${
                      !enableInvitations || selectedMethods.length === 0
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
            </div>
          </div>
        )}

        {/* Information Note */}
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-600">
            <strong>Note:</strong> Invitation costs will be added to your event
            creation fee. You can manage and send invitations after your event
            is created and payment is processed.
          </p>
        </div>
      </div>
    </div>
  );
};
