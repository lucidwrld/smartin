"use client";

import React, { useEffect, useState } from "react";
import ImageUploader from "@/components/ImageUploader";
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
    selectedChannels: [],
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

  const handleChannelSelection = (channelId) => {
    setFormData(prev => ({
      ...prev,
      selectedChannels: prev.selectedChannels.includes(channelId)
        ? prev.selectedChannels.filter(id => id !== channelId)
        : [...prev.selectedChannels, channelId]
    }));
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

    // Only upload if it's a new image (File object)
    if (formData.thankYouImage && isNewImage) {
      const imageUrl = await handleFileUpload(formData.thankYouImage);
      updatedFormData.thankYouImage = imageUrl;
    }

    const details = {
      thank_you_message: {
        image: updatedFormData.thankYouImage,
        message: updatedFormData.thankYouMessage,
      },
    };
    updateEvent(details);
  };

  return (
    <div className="flex flex-col w-full text-brandBlack">
      <p className="text-16px leading-[28px] my-5 text-textGrey3">
        Create your thank you message for guests
      </p>
      <div className="w-full flex flex-col md:flex-row gap-8 bg-whiteColor p-4 md:p-10">
        <div className="w-full md:w-1/2">
          <ImageUploader
            onImageChange={handleImageChange}
            currentImage={formData.thankYouImage}
            height="h-72"
            label="Upload Thank You Image"
          />
        </div>

        <div className="w-full md:w-1/2 flex flex-col items-center justify-center">
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
                const isSelected = formData.selectedChannels.includes(channel.id);
                
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
            
            {formData.selectedChannels.length === 0 && (
              <p className="text-amber-600 text-sm mt-2">
                Please select at least one channel to send thank you messages.
              </p>
            )}
          </div>

          {/* Voice Recording Section */}
          {formData.selectedChannels.includes("voice") && (
            <div className="w-full mt-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Voice Thank You Recording</h3>
              <p className="text-sm text-gray-600 mb-4">
                Record or upload a personalized voice message to thank your guests.
              </p>
              <VoiceRecorder
                onRecordingComplete={handleVoiceRecordingComplete}
                existingRecording={formData.voiceRecording}
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
              isLoading={uploadingFile || updating}
              textColor={"text-purple-600"}
              onClick={handleSaveMessage}
            />
            <CustomButton
              radius={"rounded-full w-full"}
              buttonText={"Send Message"}
              onClick={() => {
                if (event?.thank_you_message?.message) {
                  sendNotification({
                    inviteeIds: [],
                    type: "thankyou",
                  });
                }
              }}
              isLoading={sending}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export { ThankYouMessage };
