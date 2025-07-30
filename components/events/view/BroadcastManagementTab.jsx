"use client";

import React, { useState, useEffect } from "react";
import {
  Plus,
  Send,
  Edit2,
  Trash2,
  Clock,
  Users,
  MessageSquare,
  Eye,
  EyeOff,
  Bell,
  Mail,
  Smartphone,
  CheckCircle,
  XCircle,
  AlertCircle,
  Filter,
  Calendar,
  Search,
  MessageCircle,
  Volume2,
} from "lucide-react";
import CustomButton from "@/components/Button";
import InputWithFullBoarder from "@/components/InputWithFullBoarder";
import VoiceRecorder from "@/components/VoiceRecorder";
import Loader from "@/components/Loader";

// Import broadcast controllers
import { useGetBroadcastsForEventManager } from "@/app/events/controllers/eventBroadcast/getBroadcastsForEventController";
import { CreateBroadcastManager } from "@/app/events/controllers/eventBroadcast/createBroadcastController";
import { UpdateBroadcastManager } from "@/app/events/controllers/eventBroadcast/updateBroadcastController";
import { DeleteBroadcastManager } from "@/app/events/controllers/eventBroadcast/deleteBroadcastController";
import { SendBroadcastManager } from "@/app/events/controllers/eventBroadcast/sendBroadcastController";
import { EditEventManager } from "@/app/events/controllers/editEventController";
import useGetUserCreditsManager from "@/app/events/controllers/creditManagement/getUserCreditsController";

const BroadcastManagementTab = ({ event }) => {
  // Fetch broadcasts data
  const { data: broadcastsData, isLoading: isLoadingBroadcasts, refetch: refetchBroadcasts } = useGetBroadcastsForEventManager(event?.id);
  
  // Fetch user credits
  const { data: userCredits, isLoading: loadingUserCredits } = useGetUserCreditsManager({ enabled: true });
  
  // Initialize broadcast managers
  const { createBroadcast, isLoading: isCreating, isSuccess: createSuccess } = CreateBroadcastManager();
  
  // State for current broadcast being operated on
  const [currentBroadcastId, setCurrentBroadcastId] = useState(null);
  
  // Initialize event manager for voice recording updates
  const { updateEvent } = EditEventManager({ eventId: event?.id });

  const [showModal, setShowModal] = useState(false);
  const [editingBroadcast, setEditingBroadcast] = useState(null);
  const [isViewingForDuplication, setIsViewingForDuplication] = useState(false);
  const [activeFilter, setActiveFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  
  // Track current event notification channels locally
  const [currentEventChannels, setCurrentEventChannels] = useState({
    email: event?.event_notification?.email || false,
    sms: event?.event_notification?.sms || false,
    whatsapp: event?.event_notification?.whatsapp || false,
    voice: event?.event_notification?.voice || false,
  });

  const [formData, setFormData] = useState({
    title: "",
    message: "",
    type: "announcement",
    event_notification: {
      email: false,
      sms: false,
      whatsapp: false,
      voice: false,
      // push: false,
    },
    target_audience: "all",
    scheduled_time: "",
    send_immediately: true,
    voiceRecording: null,
  });

  // Format broadcasts data
  const broadcasts = broadcastsData?.data?.data || [];

  // Initialize managers with current broadcast ID
  const { updateBroadcast, isLoading: isUpdating } = UpdateBroadcastManager({ 
    broadcastId: currentBroadcastId 
  });

  const { deleteBroadcast, isLoading: isDeleting } = DeleteBroadcastManager({ 
    broadcastId: currentBroadcastId 
  });

  const { sendBroadcast, isLoading: isSending } = SendBroadcastManager({ 
    broadcastId: currentBroadcastId 
  });

  const broadcastTypes = [
    { value: "announcement", label: "Announcement", icon: Bell },
    { value: "reminder", label: "Reminder", icon: Clock },
    { value: "update", label: "Update", icon: AlertCircle },
    { value: "welcome", label: "Welcome", icon: MessageSquare },
  ];

  const channelOptions = [
    { value: "email", label: "Email", icon: Mail },
    { value: "sms", label: "SMS", icon: Smartphone },
    { value: "whatsapp", label: "WhatsApp", icon: MessageCircle },
    { value: "voice", label: "Voice Call", icon: Volume2 },
    // { value: "push", label: "Push Notification", icon: Bell },
  ];

  const recipientOptions = [
    { value: "all", label: "All Invitees" },
    { value: "accepted", label: "Accepted Only" },
    { value: "pending", label: "Pending Only" },
    { value: "declined", label: "Declined Only" },
  ];

  const statusFilters = [
    { value: "all", label: "All Broadcasts" },
    { value: "draft", label: "Drafts" },
    { value: "scheduled", label: "Scheduled" },
    { value: "sent", label: "Sent" },
    { value: "failed", label: "Failed" },
  ];

  const handleOpenModal = (broadcast = null) => {
    // If broadcast is sent, treat it as duplication (create new) instead of editing
    const isEditing = broadcast && broadcast.status !== "sent";
    const isViewingForDuplication = broadcast && broadcast.status === "sent";
    
    setEditingBroadcast(isEditing ? broadcast : null);
    setCurrentBroadcastId(isEditing ? (broadcast?._id || broadcast?.id) : null);
    setIsViewingForDuplication(isViewingForDuplication);

    if (broadcast) {
      // For editing existing broadcast, use its channels
      // For duplication/new, use event's current notification settings
      const eventNotification = isEditing ? {
        email: false,
        sms: false,
        whatsapp: false,
        voice: false,
        // push: false,
      } : {
        email: currentEventChannels.email,
        sms: currentEventChannels.sms,
        whatsapp: currentEventChannels.whatsapp,
        voice: currentEventChannels.voice,
        // push: false,
      };
      
      // Only override with broadcast channels if we're editing
      if (isEditing && broadcast.channels) {
        broadcast.channels.forEach((channel) => {
          if (eventNotification.hasOwnProperty(channel)) {
            eventNotification[channel] = true;
          }
        });
      }

      setFormData({
        title: broadcast.title || "",
        message: broadcast.message || "",
        type: broadcast.type || "announcement",
        event_notification: eventNotification,
        target_audience: broadcast.target_audience || "all",
        scheduled_time: broadcast.scheduled_time
          ? new Date(broadcast.scheduled_time).toISOString().slice(0, 16)
          : "",
        send_immediately: isEditing ? !broadcast.scheduled_time : false,
        voiceRecording: broadcast.voiceRecording || null,
      });
    } else {
      // Pre-populate with event's current notification channels
      setFormData({
        title: "",
        message: "",
        type: "announcement",
        event_notification: {
          email: currentEventChannels.email,
          sms: currentEventChannels.sms,
          whatsapp: currentEventChannels.whatsapp,
          voice: currentEventChannels.voice,
          // push: false,
        },
        target_audience: "all",
        scheduled_time: "",
        send_immediately: false,
        voiceRecording: null,
      });
    }

    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingBroadcast(null);
    setCurrentBroadcastId(null);
    setIsViewingForDuplication(false);
    setFormData({
      title: "",
      message: "",
      type: "announcement",
      event_notification: {
        email: currentEventChannels.email,
        sms: currentEventChannels.sms,
        whatsapp: currentEventChannels.whatsapp,
        voice: currentEventChannels.voice,
        // push: false,
      },
      target_audience: "all",
      scheduled_time: "",
      send_immediately: false,
      voiceRecording: null,
    });
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleVoiceRecordingComplete = (audioBlob) => {
    setFormData((prev) => ({
      ...prev,
      voiceRecording: audioBlob,
    }));
  };

  const handleChannelToggle = async (channel) => {
    const updatedChannels = {
      ...formData.event_notification,
      [channel]: !formData.event_notification[channel]
    };
    
    setFormData((prev) => ({
      ...prev,
      event_notification: updatedChannels
    }));
    
    // Update local tracking of event channels
    setCurrentEventChannels(updatedChannels);
    
    // Update event immediately when channels are selected
    const details = {
      event_notification: updatedChannels
    };
    
    await updateEvent(details);
  };

  const handleSave = async () => {
    if (!formData.title.trim() || !formData.message.trim()) {
      alert("Please enter both title and message");
      return;
    }

    if (!Object.values(formData.event_notification).some(Boolean)) {
      alert("Please select at least one communication channel");
      return;
    }

    try {
      let voiceRecordingUrl = "";

      // Upload voice recording if there's a new one
      if (
        formData.voiceRecording &&
        typeof formData.voiceRecording !== "string"
      ) {
        // Here you would implement the file upload logic
        // voiceRecordingUrl = await handleFileUpload(formData.voiceRecording);
        
        // Update event with voice recording URL
        if (voiceRecordingUrl) {
          await updateEvent({ notification_voice_recording: voiceRecordingUrl });
        }
      }

      // Prepare broadcast data
      const broadcastData = {
        event: event.id,
        title: formData.title,
        message: formData.message,
        target_audience: formData.target_audience,
        send_immediately: formData.send_immediately,
        type: formData.type,
        // Add other fields as needed based on API requirements
      };

      // Only include scheduled_time if not sending immediately
      if (!formData.send_immediately && formData.scheduled_time) {
        broadcastData.scheduled_time = formData.scheduled_time;
      }

      if (editingBroadcast) {
        // Update existing broadcast
        await updateBroadcast(broadcastData);
      } else {
        // Create new broadcast
        await createBroadcast(broadcastData);
      }

      // Refetch broadcasts after save
      await refetchBroadcasts();
      handleCloseModal();
    } catch (error) {
      console.error("Error saving broadcast:", error);
    }
  };

  // Handle success effects
  useEffect(() => {
    if (createSuccess) {
      refetchBroadcasts();
    }
  }, [createSuccess]);

  const handleDelete = async (broadcastId) => {
    if (!confirm("Are you sure you want to delete this broadcast?")) {
      return;
    }

    setCurrentBroadcastId(broadcastId);
    try {
      await deleteBroadcast();
      await refetchBroadcasts();
    } catch (error) {
      console.error("Error deleting broadcast:", error);
    } finally {
      setCurrentBroadcastId(null);
    }
  };

  const handleSendNow = async (broadcastId) => {
    if (!confirm("Send this broadcast immediately?")) {
      return;
    }

    setCurrentBroadcastId(broadcastId);
    try {
      await sendBroadcast();
      await refetchBroadcasts();
    } catch (error) {
      console.error("Error sending broadcast:", error);
    } finally {
      setCurrentBroadcastId(null);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      draft: "bg-gray-100 text-gray-800",
      scheduled: "bg-blue-100 text-blue-800",
      sending: "bg-yellow-100 text-yellow-800",
      sent: "bg-green-100 text-green-800",
      failed: "bg-red-100 text-red-800",
    };
    return colors[status] || "bg-gray-100 text-gray-800";
  };

  const getTypeIcon = (type) => {
    const typeData = broadcastTypes.find((t) => t.value === type);
    return typeData ? typeData.icon : Bell;
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return "Not scheduled";
    return new Date(dateString).toLocaleString();
  };

  const filteredBroadcasts = broadcasts
    .filter(
      (broadcast) => activeFilter === "all" || broadcast.status === activeFilter
    )
    .filter(
      (broadcast) =>
        searchTerm === "" ||
        broadcast.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        broadcast.message?.toLowerCase().includes(searchTerm.toLowerCase())
    );

  if (loadingUserCredits) {
    return <Loader />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-semibold mb-2">Broadcast Management</h2>
          <p className="text-gray-600">
            Send announcements, reminders, and updates to your event attendees
          </p>
        </div>

        <CustomButton
          buttonText="Create Broadcast"
          prefixIcon={<Plus className="w-4 h-4" />}
          buttonColor="bg-purple-600"
          radius="rounded-md"
          onClick={() => handleOpenModal()}
        />
      </div>

      {/* Notification Credits Balance */}
      <div className="bg-green-50 p-4 rounded-lg">
        <h3 className="font-medium text-gray-900 mb-3">
          Available Notification Credits
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {channelOptions.map((channel) => {
            const Icon = channel.icon;
            // Get actual notification credits using correct field names
            const creditFieldMap = {
              email: 'notification_email_balance',
              sms: 'notification_sms_balance', 
              whatsapp: 'notification_whatsapp_balance',
              voice: 'notification_voice_balance'
            };
            const channelCredits = userCredits?.data?.[creditFieldMap[channel.value]] || 0;

            return (
              <div key={channel.value} className="flex items-center space-x-2">
                <Icon size={16} className="text-gray-600" />
                <span className="text-sm font-medium">{channel.label}:</span>
                <span className="text-sm text-green-600 font-bold">
                  {channelCredits}
                </span>
              </div>
            );
          })}
        </div>
        <p className="text-xs text-gray-500 mt-2">
          Need more credits? Purchase additional notification credits from
          Invitation Management.
        </p>
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-white p-4 rounded-lg border">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-gray-500" />
          <select
            value={activeFilter}
            onChange={(e) => setActiveFilter(e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
          >
            {statusFilters.map((filter) => (
              <option key={filter.value} value={filter.value}>
                {filter.label}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-2">
          <Search className="w-4 h-4 text-gray-500" />
          <input
            type="text"
            placeholder="Search broadcasts..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
          />
        </div>
      </div>

      {/* Broadcasts List */}
      <div className="space-y-4">
        {isLoadingBroadcasts ? (
          <div className="flex justify-center py-12">
            <Loader />
          </div>
        ) : filteredBroadcasts.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <MessageSquare className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {searchTerm || activeFilter !== "all"
                ? "No broadcasts found"
                : "No broadcasts yet"}
            </h3>
            <p className="text-gray-500 mb-4">
              {searchTerm || activeFilter !== "all"
                ? "Try adjusting your search or filter criteria"
                : "Create your first broadcast to communicate with attendees"}
            </p>
            {!searchTerm && activeFilter === "all" && (
              <CustomButton
                buttonText="Create First Broadcast"
                prefixIcon={<Plus className="w-4 h-4" />}
                buttonColor="bg-purple-600"
                radius="rounded-md"
                onClick={() => handleOpenModal()}
              />
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredBroadcasts.map((broadcast) => {
              const TypeIcon = getTypeIcon(broadcast.type);
              return (
                <div
                  key={broadcast.id}
                  className="bg-white border rounded-lg p-6 hover:shadow-md transition-shadow"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                        <TypeIcon className="w-5 h-5 text-purple-600" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 mb-1">
                          {broadcast.title}
                        </h3>
                        <p className="text-gray-600 text-sm mb-2 line-clamp-2">
                          {broadcast.message}
                        </p>

                        <div className="flex items-center gap-4 text-xs text-gray-500">
                          <span className="flex items-center gap-1">
                            <Users className="w-3 h-3" />
                            {broadcast.recipient_count || 0} recipients
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {broadcast.sent_at
                              ? `Sent ${formatDateTime(broadcast.sent_at)}`
                              : broadcast.scheduled_time
                              ? `Scheduled for ${formatDateTime(
                                  broadcast.scheduled_time
                                )}`
                              : `Created ${formatDateTime(
                                  broadcast.createdAt || broadcast.created_at
                                )}`}
                          </span>
                          <span className="flex items-center gap-1">
                            {(broadcast.channels || []).map((channel) => {
                              const channelData = channelOptions.find(
                                (c) => c.value === channel
                              );
                              const ChannelIcon =
                                channelData?.icon || MessageSquare;
                              return (
                                <span
                                  key={channel}
                                  className="flex items-center gap-1 px-2 py-1 bg-gray-100 rounded text-xs"
                                >
                                  <ChannelIcon className="w-3 h-3" />
                                  {channelData?.label || channel}
                                </span>
                              );
                            })}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span
                        className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                          broadcast.status
                        )}`}
                      >
                        {broadcast.status.charAt(0).toUpperCase() +
                          broadcast.status.slice(1)}
                      </span>

                      <div className="flex items-center gap-1">
                        {(broadcast.status === "draft" || broadcast.status === "scheduled") && (
                          <button
                            onClick={() => handleSendNow(broadcast._id || broadcast.id)}
                            className="p-1 text-gray-500 hover:text-green-600 rounded"
                            title="Send now"
                            disabled={isSending && currentBroadcastId === (broadcast._id || broadcast.id)}
                          >
                            <Send className="w-4 h-4" />
                          </button>
                        )}
                        <button
                          onClick={() => handleOpenModal(broadcast)}
                          className="p-1 text-gray-500 hover:text-blue-600 rounded"
                          title={broadcast.status === "sent" ? "View & Duplicate" : "Edit broadcast"}
                        >
                          {broadcast.status === "sent" ? <Eye className="w-4 h-4" /> : <Edit2 className="w-4 h-4" />}
                        </button>
                        {(broadcast.status === "draft" || broadcast.status === "scheduled") && (
                          <button
                            onClick={() => handleDelete(broadcast._id || broadcast.id)}
                            className="p-1 text-gray-500 hover:text-red-600 rounded"
                            title="Delete broadcast"
                            disabled={isDeleting && currentBroadcastId === (broadcast._id || broadcast.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Analytics for sent broadcasts */}
                  {broadcast.status === "sent" && broadcast.open_rate > 0 && (
                    <div className="border-t pt-4">
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <p className="text-gray-500">Delivered</p>
                          <p className="font-semibold">
                            {broadcast.recipient_count}
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-500">Open Rate</p>
                          <p className="font-semibold">
                            {broadcast.open_rate || 0}%
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-500">Click Rate</p>
                          <p className="font-semibold">
                            {broadcast.click_rate || 0}%
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-500">Engagement</p>
                          <p className="font-semibold text-green-600">Good</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-purple-600" />
                  {isViewingForDuplication ? "View & Duplicate Broadcast" : 
                   editingBroadcast ? "Edit Broadcast" : "Create New Broadcast"}
                </h3>
                <button
                  onClick={handleCloseModal}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XCircle className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-4">
                <InputWithFullBoarder
                  label="Broadcast Title *"
                  placeholder="Enter broadcast title"
                  value={formData.title}
                  onChange={(e) => handleInputChange("title", e.target.value)}
                  isRequired={true}
                />

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Broadcast Type
                  </label>
                  <select
                    value={formData.type}
                    onChange={(e) => handleInputChange("type", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                  >
                    {broadcastTypes.map((type) => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </select>
                </div>

                <InputWithFullBoarder
                  label="Message *"
                  placeholder="Enter your broadcast message"
                  isTextArea={true}
                  rows={5}
                  value={formData.message}
                  onChange={(e) => handleInputChange("message", e.target.value)}
                  isRequired={true}
                />

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Communication Channels
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                    {channelOptions.map((channel) => {
                      const ChannelIcon = channel.icon;
                      return (
                        <label
                          key={channel.value}
                          className={`flex items-center gap-2 p-3 border rounded-md cursor-pointer transition-colors ${
                            formData.event_notification[channel.value]
                              ? "border-purple-500 bg-purple-50"
                              : "border-gray-300 hover:border-gray-400"
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={formData.event_notification[channel.value]}
                            onChange={() => handleChannelToggle(channel.value)}
                            className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                          />
                          <ChannelIcon className="w-4 h-4" />
                          <span className="text-sm">{channel.label}</span>
                        </label>
                      );
                    })}
                  </div>
                </div>

                {/* Voice Recording Section */}
                {formData.event_notification.voice && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Voice Broadcast Recording
                    </label>
                    <p className="text-sm text-gray-600 mb-4">
                      Record or upload a voice message for your broadcast
                      announcement.
                    </p>
                    <VoiceRecorder
                      onRecordingComplete={handleVoiceRecordingComplete}
                      existingRecording={formData.voiceRecording}
                      maxFileSizeMB={5}
                      maxDurationMinutes={2}
                      acceptedFormats="audio/mp3,audio/wav,audio/m4a"
                    />
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Target Audience
                  </label>
                  <select
                    value={formData.target_audience}
                    onChange={(e) =>
                      handleInputChange("target_audience", e.target.value)
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                  >
                    {recipientOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="flex items-center gap-2 mb-3">
                    <input
                      type="checkbox"
                      checked={formData.send_immediately}
                      onChange={(e) =>
                        handleInputChange("send_immediately", e.target.checked)
                      }
                      className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                    />
                    <span className="text-sm font-medium text-gray-700">
                      Send immediately
                    </span>
                  </label>

                  {!formData.send_immediately && (
                    <InputWithFullBoarder
                      label="Schedule For"
                      type="datetime-local"
                      value={formData.scheduled_time}
                      onChange={(e) =>
                        handleInputChange("scheduled_time", e.target.value)
                      }
                    />
                  )}
                </div>

                <div className="flex gap-3 pt-4">
                  {isViewingForDuplication ? (
                    <>
                      <CustomButton
                        buttonText="Duplicate & Send Now"
                        prefixIcon={<Send className="w-4 h-4" />}
                        buttonColor="bg-purple-600"
                        radius="rounded-md"
                        isLoading={isCreating}
                        onClick={() => {
                          setFormData(prev => ({ ...prev, send_immediately: true }));
                          handleSave();
                        }}
                      />
                      <CustomButton
                        buttonText="Duplicate as Draft"
                        buttonColor="bg-gray-300"
                        textColor="text-gray-700"
                        radius="rounded-md"
                        isLoading={isCreating}
                        onClick={() => {
                          setFormData(prev => ({ 
                            ...prev, 
                            send_immediately: false,
                            scheduled_time: "" 
                          }));
                          handleSave();
                        }}
                      />
                    </>
                  ) : (
                    <>
                      <CustomButton
                        buttonText={
                          formData.send_immediately
                            ? "Send Now"
                            : "Schedule Broadcast"
                        }
                        prefixIcon={<Send className="w-4 h-4" />}
                        buttonColor="bg-purple-600"
                        radius="rounded-md"
                        isLoading={isCreating || isUpdating}
                        onClick={handleSave}
                      />
                      <CustomButton
                        buttonText="Save as Draft"
                        buttonColor="bg-gray-300"
                        textColor="text-gray-700"
                        radius="rounded-md"
                        onClick={() => {
                          setFormData((prev) => ({
                            ...prev,
                            send_immediately: false,
                            scheduled_time: "",
                          }));
                          handleSave();
                        }}
                      />
                    </>
                  )}
                  <CustomButton
                    buttonText="Cancel"
                    buttonColor="bg-gray-100"
                    textColor="text-gray-700"
                    radius="rounded-md"
                    onClick={handleCloseModal}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BroadcastManagementTab;
