"use client";

import React, { useState, useRef, useCallback } from "react";
import { Calendar, Camera, Clock, MapPin } from "lucide-react";
import Webcam from "react-webcam";
import Image from "next/image";
import { logo } from "@/public/images";
import { Divider } from "@mui/material";
import CustomButton from "@/components/Button";
import { EventSchedule } from "@/components/EventSchedule";

const AcceptInvitePage = ({ verificationType = "facial" }) => {
  const [photo, setPhoto] = useState(null);
  const [isCameraOn, setIsCameraOn] = useState(false);
  const webcamRef = useRef(null);

  const startCamera = () => {
    setIsCameraOn(true);
  };

  const stopCamera = () => {
    setIsCameraOn(false);
  };

  const capturePhoto = useCallback(() => {
    const imageSrc = webcamRef.current.getScreenshot();
    setPhoto(imageSrc);
    stopCamera();
  }, [webcamRef]);

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhoto(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleConfirmAndAccept = () => {
    console.log("Confirming and accepting invitation with photo:", photo);
  };

  const videoConstraints = {
    width: 720,
    height: 720,
    facingMode: "user",
  };

  if (verificationType !== "facial") {
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col text-brandBlack">
      {/* Header */}
      <header className="w-full bg-white shadow-sm py-4 px-4 md:px-6">
        <div className="container mx-auto flex justify-between items-center">
          <Image src={logo} alt="Logo" className="h-8 md:h-10 w-auto" />
          <h1 className="text-lg md:text-xl font-medium text-brandBlack">
            Accept Invitation
          </h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow container mx-auto px-4 py-6 md:py-8 bg-[#F9FAFB]">
        <div className="w-full max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row gap-4 md:gap-10">
            {/* Left side - Instructions */}
            <div className="w-full md:w-1/2 p-4 md:p-8 bg-whiteColor rounded-[12px] min-h-0 md:min-h-[663px] flex flex-col items-center justify-center gap-3">
              <div className="space-y-4 md:space-y-6 w-full">
                <div>
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-medium mb-4 md:mb-6 text-base md:text-lg">
                        Submit Your Photo for Facial Verification
                      </h3>
                      <p className="text-gray-600 text-sm">
                        We would use facial recognition technology to grant you
                        seamless access to the event.
                      </p>
                    </div>

                    <div>
                      <h4 className="font-medium mb-2 text-sm md:text-base">
                        Short instructions on how to take a clear photo:
                      </h4>
                      <ul className="text-sm text-gray-600 space-y-2">
                        <li>1. Ensure your face is well-lit.</li>
                        <li>2. Remove hats and sunglasses.</li>
                        <li>3. Keep a neutral expression.</li>
                      </ul>
                    </div>
                    <Divider />

                    <div className="pt-4 gap-4">
                      <h3 className="font-medium text-base md:text-lg">
                        Cholma & Damilare's Wedding Ceremony
                      </h3>
                      <p className="text-sm text-gray-600 mt-2">
                        The families of Prof & Dr (Mrs) Sayekemi & Chief & Mrs
                        Ope request the honour of your presence at the wedding
                        ceremony of their children, Cholma & Damilare.
                      </p>
                      <EventSchedule
                        date="Tuesday, December 10, 2024"
                        time="10:00 AM"
                        location="Eko Hotels & Suite, VI Lagos"
                        eventName="Cholma & Damilare's Wedding Ceremony"
                        description="Wedding ceremony of Cholma & Damilare"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right side - Photo upload/preview */}
            <div className="w-full md:w-1/2 p-4 md:p-8 flex flex-col items-center justify-center bg-whiteColor rounded-[12px] min-h-0 md:min-h-[663px] gap-3">
              <div className="w-full max-w-[500px] aspect-square rounded-lg flex items-center justify-center bg-[#FAFAFA] mb-4 md:mb-6 overflow-hidden">
                {isCameraOn ? (
                  <Webcam
                    ref={webcamRef}
                    audio={false}
                    screenshotFormat="image/jpeg"
                    videoConstraints={videoConstraints}
                    className="w-full h-full object-cover"
                  />
                ) : photo ? (
                  <img
                    src={photo}
                    alt="Uploaded preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="p-4 rounded-full bg-grey3">
                    <Camera className="w-6 h-6 md:w-8 md:h-8 text-brandBlack" />
                  </div>
                )}
              </div>

              <div className="space-y-3 md:space-y-4 w-full max-w-[500px]">
                {photo ? (
                  <>
                    <CustomButton
                      buttonText={"Confirm and Accept"}
                      buttonColor={"bg-purple-600"}
                      radius={"rounded-full w-full"}
                      onClick={handleConfirmAndAccept}
                    />
                    <CustomButton
                      buttonText={"Retake Photo"}
                      buttonColor={
                        "bg-transparent border border-purple-600 border-1 hover:bg-purple-50"
                      }
                      radius={"rounded-full w-full"}
                      textColor={"text-purple-600"}
                      onClick={() => setPhoto(null)}
                    />
                  </>
                ) : (
                  <>
                    {isCameraOn ? (
                      <CustomButton
                        buttonText={"Take Photo"}
                        buttonColor={"bg-purple-600"}
                        radius={"rounded-full w-full"}
                        onClick={capturePhoto}
                      />
                    ) : (
                      <CustomButton
                        buttonText={"Capture Photo"}
                        buttonColor={"bg-purple-600"}
                        radius={"rounded-full w-full"}
                        onClick={startCamera}
                      />
                    )}

                    <div className="relative">
                      <CustomButton
                        buttonText={"Upload Photo"}
                        buttonColor={
                          "bg-transparent border border-purple-600 border-1 hover:bg-purple-50"
                        }
                        radius={"rounded-full w-full"}
                        textColor={"text-purple-600"}
                        onClick={() =>
                          document.getElementById("photo-input").click()
                        }
                      />
                      <input
                        id="photo-input"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleFileUpload}
                      />
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t py-4 md:py-6">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-3 text-sm text-gray-600">
            <p>Powered by Smart Invites © {new Date().getFullYear()}</p>
            <div className="flex gap-4 md:gap-6">
              <a href="/privacy" className="hover:text-brandPurple">
                Privacy Policy
              </a>
              <a href="/terms" className="hover:text-brandPurple">
                Terms & Conditions
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default AcceptInvitePage;
