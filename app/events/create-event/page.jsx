"use client";
import React, { useState } from "react";
import BaseDashboardNavigation from "@/components/BaseDashboardNavigation";
import StepProgress from "@/components/StepProgress";
import { EventDetailsStep } from "@/components/events/EventDetailsStep";
import { InvitationSettingsStep } from "@/components/events/InvitationStep";
import { PaymentStep } from "@/components/events/PaymentStep";
import { GalleryStep } from "@/components/events/GalleryStep";
import { GiftRegistryStep } from "@/components/events/GiftRegistryStep";
import { GuestListStep } from "@/components/events/GuestListStep";

const CreateEventPage = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    // Event Details
    eventTitle: "",
    description: "",
    date: "",
    time: "",
    venue: "",
    eventType: "",
    expectedGuests: "",
    eventImage: null,

    // Invitation Settings
    hostNames: "",
    verificationMethod: "",

    // Payment
    paymentMethod: "",
    // Gallery
    gallery: [],

    // Gift Registry
    giftRegistry: [],
    bankName: "",
    accountNumber: "",
    accountName: "",

    // Guest List
    guestList: [],
  });

  const handleFormDataChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const steps = [
    {
      title: "Event Details",
      component: (
        <EventDetailsStep
          formData={formData}
          onFormDataChange={handleFormDataChange}
        />
      ),
    },
    {
      title: "Invitation Settings",
      component: (
        <InvitationSettingsStep
          formData={formData}
          onFormDataChange={handleFormDataChange}
        />
      ),
    },
    {
      title: "Payment",
      component: (
        <PaymentStep
          formData={formData}
          onFormDataChange={handleFormDataChange}
        />
      ),
    },
    {
      title: "Gallery",
      component: (
        <GalleryStep
          formData={formData}
          onFormDataChange={handleFormDataChange}
        />
      ),
    },
    {
      title: "Gift Registry",
      component: (
        <GiftRegistryStep
          formData={formData}
          onFormDataChange={handleFormDataChange}
        />
      ),
    },
    {
      title: "Guest List",
      component: (
        <GuestListStep
          formData={formData}
          onFormDataChange={handleFormDataChange}
        />
      ),
    },
  ];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handleSubmit = async () => {
    // Here you can handle the final submission
    console.log("Form Data:", formData);
    // Add your API call or submission logic here
  };

  return (
    <BaseDashboardNavigation title="Create Event">
      <div className="w-full max-w-7xl mx-auto px-4">
        <div className="w-full space-y-8 text-brandBlack">
          <StepProgress
            steps={steps.map((step) => step.title)}
            currentStep={currentStep}
            onStepClick={setCurrentStep}
          />

          <form className="w-full" onSubmit={(e) => e.preventDefault()}>
            {steps[currentStep].component}

            <div className="flex justify-between mt-8">
              <button
                type="button"
                onClick={handlePrevious}
                disabled={currentStep === 0}
                className="px-4 py-2 bg-gray-100 rounded-lg disabled:opacity-50"
              >
                Previous
              </button>
              {currentStep === steps.length - 1 ? (
                <button
                  type="button"
                  onClick={handleSubmit}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg"
                >
                  Submit
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleNext}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg"
                >
                  Next
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </BaseDashboardNavigation>
  );
};

export default CreateEventPage;
