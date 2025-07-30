"use client";

import React, { useEffect, useState } from "react";
// import ImageUploader from "@/components/ImageUploader";
import InputWithFullBoarder from "@/components/InputWithFullBoarder";
import CustomButton from "@/components/Button";
import VoiceRecorder from "@/components/VoiceRecorder";
import { EditEventManager } from "@/app/events/controllers/editEventController";
import useFileUpload from "@/utils/fileUploadController";
import { SendNotificationManager } from "@/app/notifications/controllers/sendNotificationController";
import { Mail, MessageSquare, Phone, Volume2 } from "lucide-react";

const ThankYouMessage = ({ event }) => {
  const [formData, setFormData] = useState({
    thankYouImage: null,
    thankYouMessage: "",
    thankyou_notification: {
      email: false,
      sms: false,
      whatsapp: false,
      voice: false
    },
    voiceRecording: null,
  });

  const [isNewImage, setIsNewImage] = useState(false);
  
  const channelOptions = [
    { id: "email", name: "Email", icon: Mail, price: 15 },
    { id: "sms", name: "SMS", icon: MessageSquare, price: 25 },
    { id: "whatsapp", name: "WhatsApp", icon: Phone, price: 20 },
    { id: "voice", name: "Voice Call", icon: Volume2, price: 80 }
  ];

  const {
    progress,
    handleFileUpload,
    isLoading: uploadingFile,
  } = useFileUpload();

  const { isLoading: updating, updateEvent } = EditEventManager({
    eventId: event?.id,
  });
  const { sendNotification, isLoading: sending } = SendNotificationManager({
    eventId: event?.id,
  });

  useEffect(() => {
    if (event) {
      setFormData({
        ...formData,
        thankYouImage: event?.thank_you_message?.image,
        thankYouMessage: event?.thank_you_message?.message,
        thankyou_notification: {
          email: event?.thankyou_notification?.email || false,
          sms: event?.thankyou_notification?.sms || false,
          whatsapp: event?.thankyou_notification?.whatsapp || false,
          voice: event?.thankyou_notification?.voice || false
        },
        voiceRecording: event?.auto_settings?.auto_thankyou?.recording || null,
      });
      setIsNewImage(false); // Reset when event data changes
    }
  }, [event]);

  const handleImageChange = (file) => {
    setFormData((prev) => ({
      ...prev,
      thankYouImage: file,
    }));
    setIsNewImage(true); // Set to true when new file is selected
  };

  const handleChannelSelection = async (channelId) => {
    const updatedChannels = {
      ...formData.thankyou_notification,
      [channelId]: !formData.thankyou_notification[channelId]
    };
    
    setFormData(prev => ({
      ...prev,
      thankyou_notification: updatedChannels
    }));
    
    // Update event immediately when channels are selected
    const details = {
      thankyou_notification: updatedChannels
    };
    
    await updateEvent(details);
  };

  const handleVoiceRecordingComplete = (audioBlob) => {
    setFormData(prev => ({
      ...prev,
      voiceRecording: audioBlob
    }));
  };

  const handleMessageChange = (e) => {
    const message = e.target.value;
    if (message.split(/\s+/).length <= 200) {
      setFormData((prev) => ({
        ...prev,
        thankYouMessage: message,
      }));
    }
  };

  const handleSaveMessage = async () => {
    const updatedFormData = { ...formData };
    let thankYouRecordingUrl = event?.auto_settings?.auto_thankyou?.recording || "";

    // Only upload if it's a new image (File object)
    if (formData.thankYouImage && isNewImage) {
      const imageUrl = await handleFileUpload(formData.thankYouImage);
      updatedFormData.thankYouImage = imageUrl;
    }

    // Upload voice recording if there's a new one
    if (formData.voiceRecording && typeof formData.voiceRecording !== 'string') {
      thankYouRecordingUrl = await handleFileUpload(formData.voiceRecording);
    }

    const details = {
      thank_you_message: {
        image: updatedFormData.thankYouImage,
        message: updatedFormData.thankYouMessage,
      },
      thankyou_notification: updatedFormData.thankyou_notification,
      auto_settings: {
        ...event?.auto_settings,
        auto_thankyou: {
          active: event?.auto_settings?.auto_thankyou?.active || false,
          recording: thankYouRecordingUrl
        }
      },
    };
    await updateEvent(details);
    return true; // Return true on success
  };

  const handleSendMessage = async () => {
    // First save the message
    const saved = await handleSaveMessage();
    
    if (saved && formData.thankYouMessage) {
      // Then send the notification
      sendNotification({
        inviteeIds: [],
        type: "thankyou",
      });
    }
  };

  return (
    <div className="flex flex-col w-full text-brandBlack">
      <p className="text-16px leading-[28px] my-5 text-textGrey3">
        Create your thank you message for guests
      </p>
      <div className="w-full flex flex-col md:flex-row gap-8 bg-whiteColor p-4 md:p-10">
        {/* <div className="w-full md:w-1/2">
          <ImageUploader
            onImageChange={handleImageChange}
            currentImage={formData.thankYouImage}
            height="h-72"
            label="Upload Thank You Image"
          />
        </div> */}

        <div className="w-full flex flex-col items-center justify-center">
          <div className="w-full">
            <InputWithFullBoarder
              label="Thank You Message"
              id="thankYouMessage"
              isRequired={true}
              value={formData.thankYouMessage}
              showCharacterCount={true}
              placeholder="Write your thank you message (max 200 words)"
              className="h-40 w-full"
              isTextArea={true}
              maxLength={200}
              rows={6}
              onChange={handleMessageChange}
            />
          </div>

          {/* Channel Selection */}
          <div className="w-full mt-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Select Thank You Message Channels</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {channelOptions.map(channel => {
                const Icon = channel.icon;
                const isSelected = formData.thankyou_notification[channel.id];
                
                return (
                  <button
                    key={channel.id}
                    onClick={() => handleChannelSelection(channel.id)}
                    className={`p-3 border rounded-lg text-left transition-colors ${
                      isSelected
                        ? "border-purple-500 bg-purple-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <Icon size={18} className={isSelected ? "text-purple-600" : "text-gray-600"} />
                      <div className="flex-1">
                        <p className="font-medium text-gray-900 text-sm">{channel.name}</p>
                        <p className="text-xs text-gray-600">₦{channel.price} per message</p>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
            
            {!Object.values(formData.thankyou_notification).some(Boolean) && (
              <p className="text-amber-600 text-sm mt-2">
                Please select at least one channel to send thank you messages.
              </p>
            )}
          </div>

          {/* Voice Recording Section */}
          {formData.thankyou_notification.voice && (
            <div className="w-full mt-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Voice Thank You Recording</h3>
              <p className="text-sm text-gray-600 mb-4">
                Record or upload a personalized voice message to thank your guests.
              </p>
              {event?.auto_settings?.auto_thankyou?.recording && !formData.voiceRecording && (
                <div className="mb-4 p-3 bg-blue-50 rounded">
                  <p className="text-sm text-gray-700 mb-2">Existing recording:</p>
                  <audio controls className="w-full">
                    <source src={event.auto_settings.auto_thankyou.recording} type="audio/mpeg" />
                    Your browser does not support the audio element.
                  </audio>
                </div>
              )}
              <VoiceRecorder
                onRecordingComplete={handleVoiceRecordingComplete}
                existingRecording={formData.voiceRecording}
                maxFileSizeMB={5}
                maxDurationMinutes={2}
                acceptedFormats="audio/mp3,audio/wav,audio/m4a"
              />
            </div>
          )}

          <div className="w-full flex items-center justify-center gap-5 mt-6">
            <CustomButton
              radius={"rounded-full w-full"}
              buttonText={"Save Message"}
              buttonColor={
                "bg-whiteColor hover:bg-purple-50 border border-purple-600"
              }
              isLoading={updating}
              textColor={"text-purple-600"}
              onClick={handleSaveMessage}
            />
            <CustomButton
              radius={"rounded-full w-full"}
              buttonText={"Send Message"}
              onClick={handleSendMessage}
              isLoading={sending || updating}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export { ThankYouMessage };
