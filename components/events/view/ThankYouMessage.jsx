"use client";

import React, { useState } from "react";
import ImageUploader from "@/components/ImageUploader";
import InputWithFullBoarder from "@/components/InputWithFullBoarder";
import CustomButton from "@/components/Button";

const ThankYouMessage = () => {
  const [formData, setFormData] = useState({
    thankYouImage: null,
    thankYouMessage: "",
  });

  const handleImageChange = (file) => {
    setFormData((prev) => ({
      ...prev,
      thankYouImage: file,
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

  const wordCount = formData.thankYouMessage?.split(/\s+/).length || 0;

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
          {/* <p className="text-sm text-gray-500 mt-2">{wordCount}/200 words</p> */}
          <div className="w-full flex items-center justify-center gap-5">
            <CustomButton
              radius={"rounded-full w-full"}
              buttonText={"Save Message"}
              buttonColor={
                "bg-whiteColor hover:bg-purple-50 border border-purple-600"
              }
              textColor={"text-purple-600"}
            />
            <CustomButton
              radius={"rounded-full w-full"}
              buttonText={"Send Message"}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export { ThankYouMessage };
