"use client";

import React, { useEffect, useState } from "react";
import ImageUploader from "@/components/ImageUploader";
import InputWithFullBoarder from "@/components/InputWithFullBoarder";
import CustomButton from "@/components/Button";
import { EditEventManager } from "@/app/events/controllers/editEventController";
import useFileUpload from "@/utils/fileUploadController";
import { SendNotificationManager } from "@/app/notifications/controllers/sendNotificationController";

const ThankYouMessage = ({ event }) => {
  const [formData, setFormData] = useState({
    thankYouImage: null,
    thankYouMessage: "",
  });

  const [isNewImage, setIsNewImage] = useState(false);

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
      <div className="w-full flex flex-col md:flex-row gap-8 bg-whiteColor p-10">
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
          <div className="w-full flex items-center justify-center gap-5">
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
