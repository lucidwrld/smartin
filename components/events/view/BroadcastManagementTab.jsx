"use client";

import React, { useState } from "react";
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
  Volume2
} from "lucide-react";
import CustomButton from "@/components/Button";
import InputWithFullBoarder from "@/components/InputWithFullBoarder";
import VoiceRecorder from "@/components/VoiceRecorder";

const BroadcastManagementTab = ({ event }) => {
  const [broadcasts, setBroadcasts] = useState([
    {
      id: "broadcast_1",
      title: "Event Reminder - 24 Hours to Go!",
      message: "Don't forget about our upcoming event tomorrow. We're excited to see you there!",
      type: "reminder",
      channels: ["email", "sms", "whatsapp"],
      recipients: "all",
      scheduled_for: "2024-07-21T09:00:00",
      status: "sent",
      sent_at: "2024-07-21T09:00:00",
      recipient_count: 245,
      open_rate: 78.5,
      click_rate: 12.3,
      created_at: "2024-07-20T15:30:00"
    },
    {
      id: "broadcast_2", 
      title: "Venue Change Important Update",
      message: "Due to unforeseen circumstances, our event venue has been changed. Please check your email for the new location details.",
      type: "update",
      channels: ["email", "push"],
      recipients: "accepted",
      scheduled_for: null,
      status: "draft",
      sent_at: null,
      recipient_count: 0,
      open_rate: 0,
      click_rate: 0,
      created_at: "2024-07-22T10:15:00"
    }
  ]);

  const [showModal, setShowModal] = useState(false);
  const [editingBroadcast, setEditingBroadcast] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [activeFilter, setActiveFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  const [formData, setFormData] = useState({
    title: "",
    message: "",
    type: "announcement",
    channels: ["email"],
    recipients: "all",
    scheduled_for: "",
    send_immediately: true,
    voiceRecording: null
  });

  const broadcastTypes = [
    { value: "announcement", label: "Announcement", icon: Bell },
    { value: "reminder", label: "Reminder", icon: Clock },
    { value: "update", label: "Update", icon: AlertCircle },
    { value: "welcome", label: "Welcome", icon: MessageSquare }
  ];

  const channelOptions = [
    { value: "email", label: "Email", icon: Mail },
    { value: "sms", label: "SMS", icon: Smartphone },
    { value: "whatsapp", label: "WhatsApp", icon: MessageCircle },
    { value: "voice", label: "Voice Call", icon: Volume2 },
    { value: "push", label: "Push Notification", icon: Bell }
  ];

  const recipientOptions = [
    { value: "all", label: "All Invitees" },
    { value: "accepted", label: "Accepted Only" },
    { value: "pending", label: "Pending Only" },
    { value: "declined", label: "Declined Only" },
    { value: "vip", label: "VIP Guests" },
    { value: "custom", label: "Custom Selection" }
  ];

  const statusFilters = [
    { value: "all", label: "All Broadcasts" },
    { value: "draft", label: "Drafts" },
    { value: "scheduled", label: "Scheduled" },
    { value: "sent", label: "Sent" },
    { value: "failed", label: "Failed" }
  ];

  const handleOpenModal = (broadcast = null) => {
    setEditingBroadcast(broadcast);
    
    if (broadcast) {
      setFormData({
        title: broadcast.title || "",
        message: broadcast.message || "",
        type: broadcast.type || "announcement",
        channels: broadcast.channels || ["email"],
        recipients: broadcast.recipients || "all",
        scheduled_for: broadcast.scheduled_for ? new Date(broadcast.scheduled_for).toISOString().slice(0, 16) : "",
        send_immediately: !broadcast.scheduled_for,
        voiceRecording: broadcast.voiceRecording || null
      });
    } else {
      setFormData({
        title: "",
        message: "",
        type: "announcement",
        channels: ["email"],
        recipients: "all",
        scheduled_for: "",
        send_immediately: true,
        voiceRecording: null
      });
    }
    
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingBroadcast(null);
    setFormData({
      title: "",
      message: "",
      type: "announcement",
      channels: ["email"],
      recipients: "all",
      scheduled_for: "",
      send_immediately: true,
      voiceRecording: null
    });
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleVoiceRecordingComplete = (audioBlob) => {
    setFormData(prev => ({
      ...prev,
      voiceRecording: audioBlob
    }));
  };

  const handleChannelToggle = (channel) => {
    setFormData(prev => ({
      ...prev,
      channels: prev.channels.includes(channel)
        ? prev.channels.filter(c => c !== channel)
        : [...prev.channels, channel]
    }));
  };

  const handleSave = async () => {
    if (!formData.title.trim() || !formData.message.trim()) {
      alert("Please enter both title and message");
      return;
    }

    if (formData.channels.length === 0) {
      alert("Please select at least one communication channel");
      return;
    }

    setIsLoading(true);
    
    try {
      const newBroadcast = {
        id: editingBroadcast?.id || `broadcast_${Date.now()}`,
        ...formData,
        scheduled_for: formData.send_immediately ? null : formData.scheduled_for,
        status: formData.send_immediately ? "sending" : "scheduled",
        recipient_count: formData.recipients === "all" ? 245 : 120, // Mock counts
        created_at: editingBroadcast?.created_at || new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      if (editingBroadcast) {
        setBroadcasts(prev => 
          prev.map(broadcast => broadcast.id === editingBroadcast.id ? newBroadcast : broadcast)
        );
      } else {
        setBroadcasts(prev => [...prev, newBroadcast]);
      }

      // Here you would typically save to backend and send if immediate
      // if (formData.send_immediately) {
      //   await sendBroadcast(newBroadcast);
      // } else {
      //   await scheduleBroadcast(newBroadcast);
      // }

      handleCloseModal();
    } catch (error) {
      console.error("Error saving broadcast:", error);
      alert("Error saving broadcast. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (broadcastId) => {
    if (!confirm("Are you sure you want to delete this broadcast?")) {
      return;
    }

    try {
      setBroadcasts(prev => prev.filter(broadcast => broadcast.id !== broadcastId));
      // await deleteBroadcast({ eventId: event.id, broadcastId });
    } catch (error) {
      console.error("Error deleting broadcast:", error);
      alert("Error deleting broadcast. Please try again.");
    }
  };

  const handleSendNow = async (broadcastId) => {
    if (!confirm("Send this broadcast immediately?")) {
      return;
    }

    try {
      setBroadcasts(prev => 
        prev.map(broadcast => 
          broadcast.id === broadcastId 
            ? { ...broadcast, status: "sending", sent_at: new Date().toISOString() }
            : broadcast
        )
      );
      // await sendBroadcast({ eventId: event.id, broadcastId });
    } catch (error) {
      console.error("Error sending broadcast:", error);
      alert("Error sending broadcast. Please try again.");
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      draft: "bg-gray-100 text-gray-800",
      scheduled: "bg-blue-100 text-blue-800",
      sending: "bg-yellow-100 text-yellow-800",
      sent: "bg-green-100 text-green-800",
      failed: "bg-red-100 text-red-800"
    };
    return colors[status] || "bg-gray-100 text-gray-800";
  };

  const getTypeIcon = (type) => {
    const typeData = broadcastTypes.find(t => t.value === type);
    return typeData ? typeData.icon : Bell;
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return "Not scheduled";
    return new Date(dateString).toLocaleString();
  };

  const filteredBroadcasts = broadcasts
    .filter(broadcast => activeFilter === "all" || broadcast.status === activeFilter)
    .filter(broadcast => 
      searchTerm === "" || 
      broadcast.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      broadcast.message.toLowerCase().includes(searchTerm.toLowerCase())
    );

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
        <h3 className="font-medium text-gray-900 mb-3">Available Notification Credits</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {channelOptions.map(channel => {
            const Icon = channel.icon;
            // Mock credit balances - replace with actual data
            const credits = {
              email: 200,
              sms: 120,
              whatsapp: 180,
              voice: 50,
              push: 300
            };
            
            return (
              <div key={channel.value} className="flex items-center space-x-2">
                <Icon size={16} className="text-gray-600" />
                <span className="text-sm font-medium">{channel.label}:</span>
                <span className="text-sm text-green-600 font-bold">{credits[channel.value] || 0}</span>
              </div>
            );
          })}
        </div>
        <p className="text-xs text-gray-500 mt-2">
          Need more credits? Purchase additional notification credits from Invitation Management.
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
        {filteredBroadcasts.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <MessageSquare className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {searchTerm || activeFilter !== "all" ? "No broadcasts found" : "No broadcasts yet"}
            </h3>
            <p className="text-gray-500 mb-4">
              {searchTerm || activeFilter !== "all" 
                ? "Try adjusting your search or filter criteria"
                : "Create your first broadcast to communicate with attendees"
              }
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
                        <h3 className="font-semibold text-gray-900 mb-1">{broadcast.title}</h3>
                        <p className="text-gray-600 text-sm mb-2 line-clamp-2">{broadcast.message}</p>
                        
                        <div className="flex items-center gap-4 text-xs text-gray-500">
                          <span className="flex items-center gap-1">
                            <Users className="w-3 h-3" />
                            {broadcast.recipient_count} recipients
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {broadcast.sent_at ? `Sent ${formatDateTime(broadcast.sent_at)}` : 
                             broadcast.scheduled_for ? `Scheduled for ${formatDateTime(broadcast.scheduled_for)}` :
                             `Created ${formatDateTime(broadcast.created_at)}`}
                          </span>
                          <span className="flex items-center gap-1">
                            {broadcast.channels.map((channel) => {
                              const channelData = channelOptions.find(c => c.value === channel);
                              const ChannelIcon = channelData?.icon || MessageSquare;
                              return (
                                <span key={channel} className="flex items-center gap-1 px-2 py-1 bg-gray-100 rounded text-xs">
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
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(broadcast.status)}`}>
                        {broadcast.status.charAt(0).toUpperCase() + broadcast.status.slice(1)}
                      </span>
                      
                      <div className="flex items-center gap-1">
                        {broadcast.status === "draft" && (
                          <button
                            onClick={() => handleSendNow(broadcast.id)}
                            className="p-1 text-gray-500 hover:text-green-600 rounded"
                            title="Send now"
                          >
                            <Send className="w-4 h-4" />
                          </button>
                        )}
                        <button
                          onClick={() => handleOpenModal(broadcast)}
                          className="p-1 text-gray-500 hover:text-blue-600 rounded"
                          title="Edit broadcast"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(broadcast.id)}
                          className="p-1 text-gray-500 hover:text-red-600 rounded"
                          title="Delete broadcast"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Analytics for sent broadcasts */}
                  {broadcast.status === "sent" && broadcast.open_rate > 0 && (
                    <div className="border-t pt-4">
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <p className="text-gray-500">Delivered</p>
                          <p className="font-semibold">{broadcast.recipient_count}</p>
                        </div>
                        <div>
                          <p className="text-gray-500">Open Rate</p>
                          <p className="font-semibold">{broadcast.open_rate}%</p>
                        </div>
                        <div>
                          <p className="text-gray-500">Click Rate</p>
                          <p className="font-semibold">{broadcast.click_rate}%</p>
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
                  {editingBroadcast ? "Edit Broadcast" : "Create New Broadcast"}
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
                            formData.channels.includes(channel.value)
                              ? "border-purple-500 bg-purple-50"
                              : "border-gray-300 hover:border-gray-400"
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={formData.channels.includes(channel.value)}
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
                {formData.channels.includes("voice") && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Voice Broadcast Recording
                    </label>
                    <p className="text-sm text-gray-600 mb-4">
                      Record or upload a voice message for your broadcast announcement.
                    </p>
                    <VoiceRecorder
                      onRecordingComplete={handleVoiceRecordingComplete}
                      existingRecording={formData.voiceRecording}
                    />
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Recipients
                  </label>
                  <select
                    value={formData.recipients}
                    onChange={(e) => handleInputChange("recipients", e.target.value)}
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
                      onChange={(e) => handleInputChange("send_immediately", e.target.checked)}
                      className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                    />
                    <span className="text-sm font-medium text-gray-700">Send immediately</span>
                  </label>

                  {!formData.send_immediately && (
                    <InputWithFullBoarder
                      label="Schedule For"
                      type="datetime-local"
                      value={formData.scheduled_for}
                      onChange={(e) => handleInputChange("scheduled_for", e.target.value)}
                    />
                  )}
                </div>

                <div className="flex gap-3 pt-4">
                  <CustomButton
                    buttonText={formData.send_immediately ? "Send Now" : "Schedule Broadcast"}
                    prefixIcon={<Send className="w-4 h-4" />}
                    buttonColor="bg-purple-600"
                    radius="rounded-md"
                    isLoading={isLoading}
                    onClick={handleSave}
                  />
                  <CustomButton
                    buttonText="Save as Draft"
                    buttonColor="bg-gray-300"
                    textColor="text-gray-700"
                    radius="rounded-md"
                    onClick={() => {
                      setFormData(prev => ({ ...prev, send_immediately: false, scheduled_for: "" }));
                      handleSave();
                    }}
                  />
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