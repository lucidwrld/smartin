import React, { useState, useEffect } from "react";
import {
  Mail,
  MessageSquare,
  Phone,
  Volume2,
  Send,
  Users,
  CreditCard,
  ShoppingCart,
  Trash2,
  Search,
  Check,
  X,
} from "lucide-react";
import VoiceRecorder from "../../VoiceRecorder";
import Button from "../../Button";
import useGetUserCreditsManager from "@/app/events/controllers/creditManagement/getUserCreditsController";
import { PurchaseCreditsManager } from "@/app/events/controllers/creditManagement/purchaseCreditsController";
import { useGetCreditPricingManager } from "@/app/events/controllers/creditManagement/getCreditPricingController";
import useGetDiscountsManager from "@/app/admin/settings/controllers/getDiscountsController";
import { EditEventManager } from "@/app/events/controllers/editEventController";
import useFileUpload from "@/utils/fileUploadController";
import Loader from "../../Loader";
import { SendNotificationManager } from "@/app/notifications/controllers/sendNotificationController";
import useGetAllEventsManager from "@/app/events/controllers/getAllEventsController";
import useGetUserDetailsManager from "@/app/profile-settings/controllers/get_UserDetails_controller";
import useGetEventInviteesManager from "@/app/events/controllers/getEventInviteesController";
import ModalManagement from "../../ModalManagement";
import InputWithFullBoarder from "../../InputWithFullBoarder";
import useDebounce from "@/utils/UseDebounce";

const InvitationManagementTab = ({ event, eventId }) => {
  const [activeTab, setActiveTab] = useState("send");
  const [eventInvitation, setEventInvitation] = useState({
    email: event?.event_invitation?.email || false,
    sms: event?.event_invitation?.sms || false,
    whatsapp: event?.event_invitation?.whatsapp || false,
    voice: event?.event_invitation?.voice || false,
  });
  const [voiceRecording, setVoiceRecording] = useState(null);
  const [existingInvitationVoiceUrl, setExistingInvitationVoiceUrl] = useState(
    event?.voice_recording || ""
  );
  const [autoReminder, setAutoReminder] = useState(
    event?.auto_settings?.auto_reminder?.active || false
  );
  const [autoThankYou, setAutoThankYou] = useState(
    event?.auto_settings?.auto_thankyou?.active || false
  );
  const [reminderRecording, setReminderRecording] = useState(null); // Will hold the file blob
  const [thankYouRecording, setThankYouRecording] = useState(null); // Will hold the file blob
  const [existingReminderUrl, setExistingReminderUrl] = useState(
    event?.auto_settings?.auto_reminder?.recording || ""
  );
  const [existingThankYouUrl, setExistingThankYouUrl] = useState(
    event?.auto_settings?.auto_thankyou?.recording || ""
  );
  const [reminderChannels, setReminderChannels] = useState({
    email: event?.reminder_notification?.email || false,
    sms: event?.reminder_notification?.sms || false,
    whatsapp: event?.reminder_notification?.whatsapp || false,
    voice: event?.reminder_notification?.voice || false,
  });
  const [thankYouChannels, setThankYouChannels] = useState({
    email: event?.thankyou_notification?.email || false,
    sms: event?.thankyou_notification?.sms || false,
    whatsapp: event?.thankyou_notification?.whatsapp || false,
    voice: event?.thankyou_notification?.voice || false,
  });
  const [selectedGroups, setSelectedGroups] = useState([]);
  const [cart, setCart] = useState([]);
  const [selectedInviteeIds, setSelectedInviteeIds] = useState([]);
  const [showInviteeModal, setShowInviteeModal] = useState(false);
  const [selectedEventForInvitees, setSelectedEventForInvitees] =
    useState(null);
  const [inviteeSearchTerm, setInviteeSearchTerm] = useState("");
  const [invitationMode, setInvitationMode] = useState("event"); // 'event' or 'specific'

  // Debounce the search term with 1 second delay
  const debouncedSearchTerm = useDebounce(inviteeSearchTerm, 1000);

  // Fetch user credits, pricing, and discounts directly from backend
  const { data: userCredits, isLoading: loadingUserCredits } =
    useGetUserCreditsManager({ enabled: true });
  const { data: creditPricing, isLoading: loadingPricing } =
    useGetCreditPricingManager();
  const { data: discounts, isLoading: loadingDiscounts } =
    useGetDiscountsManager();
  const {
    purchaseCredits,
    isLoading: purchasingCredits,
    data: purchaseData,
    isSuccess: purchaseSuccess,
  } = PurchaseCreditsManager();
  const { updateEvent, isLoading: updatingEvent } = EditEventManager({
    eventId,
  });
  const { handleFileUpload, isLoading: uploadingFile } = useFileUpload();
  const { sendNotification, isLoading: sendingInvitations } =
    SendNotificationManager({ eventId });

  // Get user details to fetch user-specific events
  const { data: userDetails } = useGetUserDetailsManager();
  const userId = userDetails?.data?.user?.id || userDetails?.data?.user?._id;

  // Fetch all user events to show as invitation groups
  const { data: eventsData, isLoading: loadingEvents } = useGetAllEventsManager(
    {
      page: 1,
      pageSize: 100, // Get a large number to show all events
      user: userId,
      isActive: true,
      enabled: Boolean(userId),
    }
  );

  // Format events data as guest groups for invitation selection
  const guestGroups =
    eventsData?.data?.map((eventItem) => ({
      id: eventItem._id || eventItem.id,
      name: `${eventItem.name} - Uninvited Guests`,
      count: eventItem.no_of_invitees || 0,
      eventName: eventItem.name,
      eventDate: eventItem.date,
      eventType: eventItem.event_type,
      venue: eventItem.venue,
      status: eventItem.status,
      guests: [], // Events don't have invitees list in this response, so empty array for preview
    })) || [];

  // Fetch invitees for selected event
  const {
    data: inviteesData,
    isLoading: loadingInvitees,
    refetch: refetchInvitees,
  } = useGetEventInviteesManager({
    eventId: selectedEventForInvitees,
    page: 1,
    pageSize: 100,
    search: debouncedSearchTerm,
    enabled: Boolean(selectedEventForInvitees),
  });

  // Get credits directly from backend data - using correct field names from API response
  const invitationCredits = {
    email: userCredits?.data?.invitation_email_balance || 0,
    sms: userCredits?.data?.invitation_sms_balance || 0,
    whatsapp: userCredits?.data?.invitation_whatsapp_balance || 0,
    voice: userCredits?.data?.invitation_voice_balance || 0,
  };

  const notificationCredits = {
    email: userCredits?.data?.notification_email_balance || 0,
    sms: userCredits?.data?.notification_sms_balance || 0,
    whatsapp: userCredits?.data?.notification_whatsapp_balance || 0,
    voice: userCredits?.data?.notification_voice_balance || 0,
  };

  // Get pricing directly from backend data
  const channelOptions = [
    {
      id: "email",
      name: "Email",
      icon: Mail,
      invitationPrice: creditPricing?.data?.invitation_email_price_naira || 10,
      notificationPrice:
        creditPricing?.data?.notification_email_price_naira || 10,
    },
    {
      id: "sms",
      name: "SMS",
      icon: MessageSquare,
      invitationPrice: creditPricing?.data?.invitation_sms_price_naira || 10,
      notificationPrice:
        creditPricing?.data?.notification_sms_price_naira || 10,
    },
    {
      id: "whatsapp",
      name: "WhatsApp",
      icon: Phone,
      invitationPrice:
        creditPricing?.data?.invitation_whatsapp_price_naira || 100,
      notificationPrice:
        creditPricing?.data?.notification_whatsapp_price_naira || 100,
    },
    {
      id: "voice",
      name: "Voice Call",
      icon: Volume2,
      invitationPrice: creditPricing?.data?.invitation_voice_price_naira || 50,
      notificationPrice:
        creditPricing?.data?.notification_voice_price_naira || 50,
    },
  ];

  const tabs = [
    { id: "send", name: "Send Invitations", icon: Send },
    { id: "credits", name: "Credit Store", icon: CreditCard },
    { id: "settings", name: "Auto Settings", icon: Users },
  ];

  const handleGroupSelection = (groupId) => {
    if (invitationMode === "event") {
      setSelectedGroups((prev) =>
        prev.includes(groupId)
          ? prev.filter((id) => id !== groupId)
          : [...prev, groupId]
      );
    } else {
      // When in specific mode, open invitee selection modal
      setSelectedEventForInvitees(groupId);
      setShowInviteeModal(true);
      setTimeout(() => {
        document.getElementById("invitee-selection-modal")?.showModal();
      }, 100);
    }
  };

  const handleInviteeSelection = (inviteeId) => {
    setSelectedInviteeIds((prev) =>
      prev.includes(inviteeId)
        ? prev.filter((id) => id !== inviteeId)
        : [...prev, inviteeId]
    );
  };

  const getSelectedInviteesFromAllEvents = () => {
    // Get unique invitee details from all selected invitees
    const inviteesMap = new Map();

    selectedInviteeIds.forEach((selection) => {
      const [eventId, inviteeId] = selection.split("_");
      const event = guestGroups.find((g) => g.id === eventId);

      if (inviteesData?.data) {
        const invitee = inviteesData.data.find(
          (i) => (i._id || i.id) === inviteeId
        );
        if (invitee) {
          inviteesMap.set(inviteeId, {
            ...invitee,
            eventName: event?.eventName,
          });
        }
      }
    });

    return Array.from(inviteesMap.values());
  };

  const handleChannelSelection = (channelId) => {
    setEventInvitation((prev) => ({
      ...prev,
      [channelId]: !prev[channelId],
    }));
  };

  const addToCart = (creditType, channel, quantity) => {
    const existing = cart.find(
      (item) => item.creditType === creditType && item.channel === channel
    );
    if (existing) {
      setCart((prev) =>
        prev.map((item) =>
          item.creditType === creditType && item.channel === channel
            ? { ...item, quantity: item.quantity + quantity }
            : item
        )
      );
    } else {
      const channelInfo = channelOptions.find((c) => c.id === channel);
      const price =
        creditType === "invitation"
          ? channelInfo.invitationPrice
          : channelInfo.notificationPrice;
      setCart((prev) => [
        ...prev,
        {
          creditType,
          channel,
          quantity,
          price,
          total: price * quantity,
          channelName: channelInfo.name,
        },
      ]);
    }
  };

  const removeFromCart = (index) => {
    setCart((prev) => prev.filter((_, i) => i !== index));
  };

  const calculateCartTotal = () => {
    return cart.reduce((total, item) => total + item.total, 0);
  };

  const handlePurchaseCredits = async () => {
    const creditsData = cart.map((item) => ({
      type: item.creditType,
      channel: item.channel,
      quantity: item.quantity,
    }));

    const purchaseData = {
      currency: "NGN",
      path: window.location.href,
      credits: creditsData,
    };

    await purchaseCredits(purchaseData);
  };

  const getSelectedGuestCount = () => {
    return selectedGroups.reduce((total, groupId) => {
      const group = guestGroups.find((g) => g.id === groupId);
      return total + (group ? group.count : 0);
    }, 0);
  };

  // Get default discounts only (not partner discounts)
  const defaultDiscounts =
    discounts?.data?.filter((discount) => discount.type === "default") || [];

  // Navigate to checkout URL when purchase is successful
  useEffect(() => {
    if (purchaseSuccess && purchaseData?.data?.payment_data?.checkoutUrl) {
      window.location.href = purchaseData.data.payment_data.checkoutUrl;
    }
  }, [purchaseSuccess, purchaseData]);

  const handleAutoSettingsUpdate = async () => {
    try {
      let reminderRecordingUrl = existingReminderUrl;
      let thankYouRecordingUrl = existingThankYouUrl;

      // Upload reminder recording if there's a new one
      if (reminderRecording && typeof reminderRecording !== "string") {
        reminderRecordingUrl = await handleFileUpload(reminderRecording);
      }

      // Upload thank you recording if there's a new one
      if (thankYouRecording && typeof thankYouRecording !== "string") {
        thankYouRecordingUrl = await handleFileUpload(thankYouRecording);
      }

      const autoSettings = {
        auto_settings: {
          auto_reminder: {
            active: autoReminder,
            recording: reminderRecordingUrl,
          },
          auto_thankyou: {
            active: autoThankYou,
            recording: thankYouRecordingUrl,
          },
        },
        reminder_notification: reminderChannels,
        thankyou_notification: thankYouChannels,
      };

      await updateEvent(autoSettings);
    } catch (error) {
      console.error("Error updating auto settings:", error);
    }
  };

  const handleReminderChannelChange = (channelId) => {
    setReminderChannels((prev) => ({
      ...prev,
      [channelId]: !prev[channelId],
    }));
  };

  const handleThankYouChannelChange = (channelId) => {
    setThankYouChannels((prev) => ({
      ...prev,
      [channelId]: !prev[channelId],
    }));
  };

  if (loadingUserCredits || loadingPricing || loadingDiscounts) {
    return <Loader />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border-b border-gray-200">
        <div className="flex justify-between items-center pb-4">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">
              Invitation Management
            </h1>
            <p className="text-gray-600">
              Manage invitations and communication credits for your event
            </p>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab.id
                  ? "border-purple-500 text-purple-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              <tab.icon size={16} />
              <span>{tab.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Credit Balance Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-blue-50 p-4 rounded-lg">
          <h3 className="font-medium text-gray-900 mb-3">Invitation Credits</h3>
          <div className="space-y-2">
            {channelOptions.map((channel) => (
              <div
                key={channel.id}
                className="flex justify-between items-center"
              >
                <div className="flex items-center space-x-2">
                  <channel.icon size={16} className="text-gray-600" />
                  <span className="text-sm">{channel.name}</span>
                </div>
                <span className="font-medium">
                  {invitationCredits[channel.id] || 0}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-green-50 p-4 rounded-lg">
          <h3 className="font-medium text-gray-900 mb-3">
            Notification Credits
          </h3>
          <div className="space-y-2">
            {channelOptions.map((channel) => (
              <div
                key={channel.id}
                className="flex justify-between items-center"
              >
                <div className="flex items-center space-x-2">
                  <channel.icon size={16} className="text-gray-600" />
                  <span className="text-sm">{channel.name}</span>
                </div>
                <span className="font-medium">
                  {notificationCredits[channel.id] || 0}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tab Content */}
      {activeTab === "send" && (
        <div className="space-y-6">
          {/* Channel Selection */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Select Invitation Channels
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {channelOptions.map((channel) => (
                <button
                  key={channel.id}
                  onClick={() => handleChannelSelection(channel.id)}
                  className={`p-4 border rounded-lg text-left transition-colors ${
                    eventInvitation[channel.id]
                      ? "border-purple-500 bg-purple-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <channel.icon
                      size={20}
                      className={
                        eventInvitation[channel.id]
                          ? "text-purple-600"
                          : "text-gray-600"
                      }
                    />
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">
                        {channel.name}
                      </p>
                      <p className="text-sm text-gray-600">
                        ₦{channel.invitationPrice} per invitation
                      </p>
                      <p className="text-xs text-gray-500">
                        Available: {invitationCredits[channel.id]} credits
                      </p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Voice Recording */}
          {eventInvitation.voice && (
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Voice Invitation Recording
              </h3>
              {existingInvitationVoiceUrl && !voiceRecording && (
                <div className="mb-4 p-3 bg-blue-50 rounded">
                  <p className="text-sm text-gray-700 mb-2">
                    Existing recording:
                  </p>
                  <audio controls className="w-full">
                    <source
                      src={existingInvitationVoiceUrl}
                      type="audio/mpeg"
                    />
                    Your browser does not support the audio element.
                  </audio>
                </div>
              )}
              <VoiceRecorder
                onRecordingComplete={setVoiceRecording}
                existingRecording={voiceRecording}
                maxFileSizeMB={5}
                maxDurationMinutes={2}
                acceptedFormats="audio/mp3,audio/wav,audio/m4a"
              />
            </div>
          )}

          {/* Invitation Mode Selection */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Invitation Mode
            </h3>
            <div className="flex gap-4 mb-6">
              <button
                onClick={() => {
                  setInvitationMode("event");
                  setSelectedInviteeIds([]);
                }}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  invitationMode === "event"
                    ? "bg-purple-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                Send to All Event Invitees
              </button>
              <button
                onClick={() => {
                  setInvitationMode("specific");
                  setSelectedGroups([]);
                }}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  invitationMode === "specific"
                    ? "bg-purple-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                Select Specific Invitees
              </button>
            </div>
          </div>

          {/* Guest Groups Selection */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              {invitationMode === "event"
                ? "Select Events to Send Invitations For"
                : "Select Event to Choose Invitees From"}
            </h3>
            {loadingEvents ? (
              <div className="flex justify-center py-8">
                <Loader />
              </div>
            ) : guestGroups.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <p>No events found</p>
              </div>
            ) : (
              <div className="space-y-3">
                {guestGroups.map((group) => (
                  <div
                    key={group.id}
                    className="border border-gray-200 rounded-lg hover:border-purple-300 transition-colors cursor-pointer"
                    onClick={() => handleGroupSelection(group.id)}
                  >
                    <div className="flex items-center space-x-3 p-4">
                      {invitationMode === "event" && (
                        <input
                          type="checkbox"
                          checked={selectedGroups.includes(group.id)}
                          onChange={() => handleGroupSelection(group.id)}
                          onClick={(e) => e.stopPropagation()}
                          className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                        />
                      )}
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">
                          {group.name}
                        </p>
                        <p className="text-sm text-gray-600">
                          {group.count} guests • Date:{" "}
                          {group.eventDate
                            ? new Date(group.eventDate).toLocaleDateString()
                            : "Not set"}
                        </p>
                      </div>
                      {invitationMode === "specific" && (
                        <button className="text-purple-600 hover:text-purple-700">
                          Select Invitees →
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Selected Invitees Summary (for specific mode) */}
          {invitationMode === "specific" && selectedInviteeIds.length > 0 && (
            <div className="bg-purple-50 p-4 rounded-lg">
              <h4 className="font-medium text-gray-900 mb-2">
                Selected Invitees ({selectedInviteeIds.length})
              </h4>
              <div className="text-sm text-gray-600">
                <p>
                  You have selected {selectedInviteeIds.length} specific
                  invitees from different events.
                </p>
              </div>
            </div>
          )}

          {/* Discounts Info */}
          {defaultDiscounts.length > 0 && (
            <div className="bg-yellow-50 p-4 rounded-lg">
              <h4 className="font-medium text-gray-900 mb-2">
                Available Discounts
              </h4>
              <div className="text-sm text-gray-600 space-y-1">
                {defaultDiscounts.map((discount, index) => (
                  <p key={index}>
                    • {discount.no_of_invites}+ credits: {discount.percent}%
                    discount
                  </p>
                ))}
              </div>
            </div>
          )}

          {/* Send Summary */}
          {((invitationMode === "event" && selectedGroups.length > 0) ||
            (invitationMode === "specific" && selectedInviteeIds.length > 0)) &&
            Object.values(eventInvitation).some(Boolean) && (
              <div className="bg-purple-50 p-4 rounded-lg">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm text-gray-600">
                      {invitationMode === "event"
                        ? `Sending to ${getSelectedGuestCount()} guests via ${
                            Object.values(eventInvitation).filter(Boolean)
                              .length
                          } channels`
                        : `Sending to ${
                            selectedInviteeIds.length
                          } selected invitees via ${
                            Object.values(eventInvitation).filter(Boolean)
                              .length
                          } channels`}
                    </p>
                    <p className="text-lg font-medium text-purple-600">
                      {invitationMode === "event"
                        ? `Selected Groups: ${selectedGroups.length}`
                        : `Selected Invitees: ${selectedInviteeIds.length}`}
                    </p>
                  </div>
                  <Button
                    buttonText="Send Invitations"
                    buttonColor="bg-purple-600 hover:bg-purple-700"
                    textColor="text-white"
                    isLoading={
                      sendingInvitations || updatingEvent || uploadingFile
                    }
                    onClick={async () => {
                      let invitationVoiceUrl = existingInvitationVoiceUrl;

                      // Upload voice recording if there's a new one
                      if (
                        voiceRecording &&
                        typeof voiceRecording !== "string"
                      ) {
                        invitationVoiceUrl = await handleFileUpload(
                          voiceRecording
                        );
                      }

                      // Update event with invitation settings and voice recording
                      await updateEvent({
                        event_invitation: eventInvitation,
                        voice_recording: invitationVoiceUrl,
                      });

                      // Send invitations based on mode
                      const notificationPayload = {
                        inviteeIds:
                          invitationMode === "specific"
                            ? selectedInviteeIds.map((id) => id.split("_")[1])
                            : [],
                        eventIds:
                          invitationMode === "event" ? selectedGroups : [],
                        type: "event", // Type is "event" for sending invitations
                      };

                      await sendNotification(notificationPayload);
                    }}
                  />
                </div>
              </div>
            )}
        </div>
      )}

      {activeTab === "credits" && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium text-gray-900">Credit Store</h3>
            {cart.length > 0 && (
              <div className="flex items-center space-x-2 text-purple-600">
                <ShoppingCart size={20} />
                <span className="font-medium">{cart.length} items in cart</span>
              </div>
            )}
          </div>

          {/* Credit Purchase Interface */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="border rounded-lg p-6">
              <h4 className="text-md font-medium text-gray-900 mb-4">
                Invitation Credits
              </h4>
              <p className="text-sm text-gray-600 mb-4">
                For sending initial event invitations
              </p>

              <div className="space-y-4">
                {channelOptions.map((channel) => (
                  <div
                    key={channel.id}
                    className="flex items-center justify-between p-3 border border-gray-200 rounded"
                  >
                    <div className="flex items-center space-x-3">
                      <channel.icon size={16} />
                      <span className="text-sm font-medium">
                        {channel.name}
                      </span>
                      <span className="text-xs text-gray-500">
                        ₦{channel.invitationPrice} each
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input
                        type="number"
                        min="1"
                        placeholder="Qty"
                        className="w-16 px-2 py-1 border border-gray-300 rounded text-xs"
                        onKeyPress={(e) => {
                          if (e.key === "Enter") {
                            const quantity = parseInt(e.target.value);
                            if (quantity > 0) {
                              addToCart("invitation", channel.id, quantity);
                              e.target.value = "";
                            }
                          }
                        }}
                      />
                      <button
                        onClick={(e) => {
                          const input = e.target.previousElementSibling;
                          const quantity = parseInt(input.value);
                          if (quantity > 0) {
                            addToCart("invitation", channel.id, quantity);
                            input.value = "";
                          }
                        }}
                        className="bg-blue-500 text-white px-3 py-1 rounded text-xs hover:bg-blue-600"
                      >
                        Add
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="border rounded-lg p-6">
              <h4 className="text-md font-medium text-gray-900 mb-4">
                Notification Credits
              </h4>
              <p className="text-sm text-gray-600 mb-4">
                For reminders, thank you messages, and broadcasts
              </p>

              <div className="space-y-4">
                {channelOptions.map((channel) => (
                  <div
                    key={channel.id}
                    className="flex items-center justify-between p-3 border border-gray-200 rounded"
                  >
                    <div className="flex items-center space-x-3">
                      <channel.icon size={16} />
                      <span className="text-sm font-medium">
                        {channel.name}
                      </span>
                      <span className="text-xs text-gray-500">
                        ₦{channel.notificationPrice} each
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input
                        type="number"
                        min="1"
                        placeholder="Qty"
                        className="w-16 px-2 py-1 border border-gray-300 rounded text-xs"
                        onKeyPress={(e) => {
                          if (e.key === "Enter") {
                            const quantity = parseInt(e.target.value);
                            if (quantity > 0) {
                              addToCart("notification", channel.id, quantity);
                              e.target.value = "";
                            }
                          }
                        }}
                      />
                      <button
                        onClick={(e) => {
                          const input = e.target.previousElementSibling;
                          const quantity = parseInt(input.value);
                          if (quantity > 0) {
                            addToCart("notification", channel.id, quantity);
                            input.value = "";
                          }
                        }}
                        className="bg-green-500 text-white px-3 py-1 rounded text-xs hover:bg-green-600"
                      >
                        Add
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Shopping Cart */}
          {cart.length > 0 && (
            <div className="border rounded-lg p-6 bg-purple-50">
              <h4 className="text-md font-medium text-gray-900 mb-4 flex items-center space-x-2">
                <ShoppingCart size={20} />
                <span>Shopping Cart</span>
              </h4>

              <div className="space-y-3">
                {cart.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-white rounded border"
                  >
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">
                        {item.channelName}{" "}
                        {item.creditType === "invitation"
                          ? "Invitation"
                          : "Notification"}{" "}
                        Credits
                      </p>
                      <p className="text-sm text-gray-600">
                        ₦{item.price} × {item.quantity} = ₦{item.total}
                      </p>
                    </div>
                    <button
                      onClick={() => removeFromCart(index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>

              <div className="border-t mt-4 pt-4 flex justify-between items-center">
                <div>
                  <p className="text-lg font-medium text-gray-900">
                    Total: ₦{calculateCartTotal()}
                  </p>
                  <p className="text-sm text-gray-600">{cart.length} items</p>
                </div>
                <Button
                  buttonText={
                    purchasingCredits ? "Processing..." : "Proceed to Payment"
                  }
                  buttonColor="bg-purple-600 hover:bg-purple-700"
                  textColor="text-white"
                  onClick={handlePurchaseCredits}
                  disabled={purchasingCredits}
                />
              </div>
            </div>
          )}

          {/* Bulk Purchase Discounts */}
          {defaultDiscounts.length > 0 && (
            <div className="bg-yellow-50 p-4 rounded-lg">
              <h4 className="font-medium text-gray-900 mb-2">
                Bulk Purchase Discounts
              </h4>
              <div className="text-sm text-gray-600 space-y-1">
                {defaultDiscounts.map((discount, index) => (
                  <p key={index}>
                    • {discount.no_of_invites}+ credits: {discount.percent}%
                    discount
                  </p>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {activeTab === "settings" && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium text-gray-900">
              Automated Settings
            </h3>
            <Button
              buttonText={
                updatingEvent || uploadingFile ? "Saving..." : "Save Settings"
              }
              buttonColor="bg-purple-600 hover:bg-purple-700"
              textColor="text-white"
              onClick={handleAutoSettingsUpdate}
              disabled={updatingEvent || uploadingFile}
            />
          </div>

          {/* Auto Reminder Settings */}
          <div className="border rounded-lg p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h4 className="font-medium text-gray-900 mb-2">
                  24-Hour Auto Reminder
                </h4>
                <p className="text-sm text-gray-600 mb-4">
                  Automatically send reminder messages to guests who haven't
                  responded 24 hours before the event.
                </p>
              </div>

              <div className="ml-4">
                <button
                  onClick={() => setAutoReminder(!autoReminder)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 ${
                    autoReminder ? "bg-purple-600" : "bg-gray-200"
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      autoReminder ? "translate-x-6" : "translate-x-1"
                    }`}
                  />
                </button>
              </div>
            </div>

            {autoReminder && (
              <div className="space-y-4">
                <h5 className="font-medium text-gray-800">
                  Select Reminder Channels:
                </h5>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {channelOptions.map((channel) => (
                    <label
                      key={channel.id}
                      className="flex items-center space-x-3"
                    >
                      <input
                        type="checkbox"
                        checked={reminderChannels[channel.id]}
                        onChange={() => handleReminderChannelChange(channel.id)}
                        className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                      />
                      <div className="flex items-center space-x-2">
                        <channel.icon size={16} />
                        <span className="text-sm">{channel.name}</span>
                        <span className="text-xs text-gray-500">
                          (₦{channel.notificationPrice})
                        </span>
                      </div>
                    </label>
                  ))}
                </div>

                {reminderChannels.voice && (
                  <div className="mt-4">
                    <h5 className="font-medium text-gray-800 mb-2">
                      Voice Recording for Reminder:
                    </h5>
                    {existingReminderUrl && !reminderRecording && (
                      <div className="mb-4 p-3 bg-blue-50 rounded">
                        <p className="text-sm text-gray-700 mb-2">
                          Existing recording:
                        </p>
                        <audio controls className="w-full">
                          <source src={existingReminderUrl} type="audio/mpeg" />
                          Your browser does not support the audio element.
                        </audio>
                      </div>
                    )}
                    <VoiceRecorder
                      onRecordingComplete={setReminderRecording}
                      existingRecording={reminderRecording}
                      maxFileSizeMB={5}
                      maxDurationMinutes={2}
                      acceptedFormats="audio/mp3,audio/wav,audio/m4a"
                    />
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Auto Thank You Settings */}
          <div className="border rounded-lg p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h4 className="font-medium text-gray-900 mb-2">
                  Auto Thank You Messages
                </h4>
                <p className="text-sm text-gray-600 mb-4">
                  Automatically send thank you messages to guests after the
                  event ends.
                </p>
              </div>

              <div className="ml-4">
                <button
                  onClick={() => setAutoThankYou(!autoThankYou)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 ${
                    autoThankYou ? "bg-purple-600" : "bg-gray-200"
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      autoThankYou ? "translate-x-6" : "translate-x-1"
                    }`}
                  />
                </button>
              </div>
            </div>

            {autoThankYou && (
              <div className="space-y-4">
                <h5 className="font-medium text-gray-800">
                  Select Thank You Channels:
                </h5>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {channelOptions.map((channel) => (
                    <label
                      key={channel.id}
                      className="flex items-center space-x-3"
                    >
                      <input
                        type="checkbox"
                        checked={thankYouChannels[channel.id]}
                        onChange={() => handleThankYouChannelChange(channel.id)}
                        className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                      />
                      <div className="flex items-center space-x-2">
                        <channel.icon size={16} />
                        <span className="text-sm">{channel.name}</span>
                        <span className="text-xs text-gray-500">
                          (₦{channel.notificationPrice})
                        </span>
                      </div>
                    </label>
                  ))}
                </div>

                {thankYouChannels.voice && (
                  <div className="mt-4">
                    <h5 className="font-medium text-gray-800 mb-2">
                      Voice Recording for Thank You:
                    </h5>
                    {existingThankYouUrl && !thankYouRecording && (
                      <div className="mb-4 p-3 bg-blue-50 rounded">
                        <p className="text-sm text-gray-700 mb-2">
                          Existing recording:
                        </p>
                        <audio controls className="w-full">
                          <source src={existingThankYouUrl} type="audio/mpeg" />
                          Your browser does not support the audio element.
                        </audio>
                      </div>
                    )}
                    <VoiceRecorder
                      onRecordingComplete={setThankYouRecording}
                      existingRecording={thankYouRecording}
                      maxFileSizeMB={5}
                      maxDurationMinutes={2}
                      acceptedFormats="audio/mp3,audio/wav,audio/m4a"
                    />
                  </div>
                )}

                <div className="mt-4 p-3 bg-blue-50 rounded">
                  <p className="text-sm text-blue-700">
                    <strong>Tip:</strong> Thank you messages will be sent 2
                    hours after your event end time.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Auto Settings Info */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-medium text-gray-900 mb-2">Important Notes</h4>
            <div className="text-sm text-gray-600 space-y-1">
              <p>• Automated messages use your notification credits</p>
              <p>
                • You can disable automation anytime before the scheduled time
              </p>
              <p>• Make sure you have sufficient credits before the event</p>
              <p>
                • Voice recordings can be set up separately for each automation
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Invitee Selection Modal */}
      <ModalManagement
        id="invitee-selection-modal"
        type="large"
        title={`Select Invitees${
          selectedEventForInvitees
            ? " from " +
              guestGroups.find((g) => g.id === selectedEventForInvitees)
                ?.eventName
            : ""
        }`}
      >
        <div className="space-y-4">
          {/* Search Bar */}
          <div className="relative">
            <InputWithFullBoarder
              id="invitee-search"
              name="search"
              type="text"
              placeholder="Search by name, email, or phone number..."
              value={inviteeSearchTerm}
              onChange={(e) => setInviteeSearchTerm(e.target.value)}
              icon={<Search className="h-5 w-5 text-gray-400" />}
            />
          </div>

          {/* Invitees List */}
          <div className="max-h-96 overflow-y-auto border border-gray-200 rounded-lg">
            {loadingInvitees ? (
              <div className="flex justify-center py-8">
                <Loader />
              </div>
            ) : inviteesData?.data?.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <p>No invitees found</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-200">
                {inviteesData?.data?.map((invitee) => {
                  const selectionId = `${selectedEventForInvitees}_${invitee._id || invitee.id}`;
                  const isSelected = selectedInviteeIds.includes(selectionId);

                  return (
                    <div
                      key={invitee._id || invitee.id}
                      className={`p-4 hover:bg-gray-50 cursor-pointer transition-colors ${
                        isSelected ? "bg-purple-50" : ""
                      }`}
                      onClick={() => handleInviteeSelection(selectionId)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <p className="font-medium text-gray-900">
                            {invitee.name}
                          </p>
                          <div className="flex gap-4 text-sm text-gray-600">
                            {invitee.email && <span>{invitee.email}</span>}
                            {invitee.phone && <span>{invitee.phone}</span>}
                          </div>
                          <div className="flex gap-2 mt-1">
                            {/* Notification sent indicators */}
                            {invitee.notification_sent && (
                              <div className="flex gap-1">
                                {invitee.notification_sent.email && (
                                  <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                                    Email Sent
                                  </span>
                                )}
                                {invitee.notification_sent.sms && (
                                  <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">
                                    SMS Sent
                                  </span>
                                )}
                                {invitee.notification_sent.whatsapp && (
                                  <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-1 rounded">
                                    WhatsApp Sent
                                  </span>
                                )}
                              </div>
                            )}
                            {/* Response status */}
                            {invitee.response && (
                              <span
                                className={`text-xs px-2 py-1 rounded ${
                                  invitee.response === "yes"
                                    ? "bg-green-100 text-green-700"
                                    : invitee.response === "no"
                                    ? "bg-red-100 text-red-700"
                                    : invitee.response === "maybe"
                                    ? "bg-yellow-100 text-yellow-700"
                                    : "bg-gray-100 text-gray-700"
                                }`}
                              >
                                {invitee.response.toUpperCase()}
                              </span>
                            )}
                            {/* Table assignment */}
                            {invitee.table && (
                              <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded">
                                Table: {invitee.table.name}
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="ml-4">
                          {isSelected ? (
                            <Check className="h-5 w-5 text-purple-600" />
                          ) : (
                            <div className="h-5 w-5 border-2 border-gray-300 rounded" />
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Modal Actions */}
          <div className="flex justify-between items-center pt-4">
            <div className="text-sm text-gray-600">
              {
                selectedInviteeIds.filter((id) =>
                  id.startsWith(selectedEventForInvitees + "_")
                ).length
              }{" "}
              invitees selected from this event
            </div>
            <div className="flex gap-3">
              <Button
                buttonText="Cancel"
                buttonColor="bg-gray-200 hover:bg-gray-300"
                textColor="text-gray-700"
                onClick={() => {
                  setShowInviteeModal(false);
                  setSelectedEventForInvitees(null);
                  setInviteeSearchTerm("");
                  document.getElementById("invitee-selection-modal").close();
                }}
              />
              <Button
                buttonText="Done"
                buttonColor="bg-purple-600 hover:bg-purple-700"
                textColor="text-white"
                onClick={() => {
                  setShowInviteeModal(false);
                  setSelectedEventForInvitees(null);
                  setInviteeSearchTerm("");
                  document.getElementById("invitee-selection-modal").close();
                }}
              />
            </div>
          </div>
        </div>
      </ModalManagement>
    </div>
  );
};

export default InvitationManagementTab;
