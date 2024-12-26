"use client";
import React, { useRef, useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import BaseDashboardNavigation from "@/components/BaseDashboardNavigation";
import StepProgress from "@/components/StepProgress";
import { EventDetailsStep } from "@/components/events/EventDetailsStep";
import { InvitationSettingsStep } from "@/components/events/InvitationStep";
import { GalleryStep } from "@/components/events/GalleryStep";
import { GiftRegistryStep } from "@/components/events/GiftRegistryStep";
import { GuestListStep } from "@/components/events/GuestListStep";
import PaymentStep from "@/components/events/PaymentStep";
import { PaymentProofModal } from "@/components/events/PaymentProofModal";
import { VerificationModal } from "@/components/events/VerificationModal";
import { validateFormSubmission } from "@/utils/validateForm";
import { CreateEventManager } from "../controllers/createEventController";
import { EditEventManager } from "../controllers/editEventController";
import useGetSingleEventManager from "../controllers/getSingleEventController";
import { getQueryParams } from "@/utils/getQueryParams";
import useFileUpload from "@/utils/fileUploadController";
import GoBackButton from "@/components/GoBackButton";

const EventPage = () => {
  const { id, section } = getQueryParams(["id", "section"]);
  const isEditMode = Boolean(id);
  const formRef = useRef(null);

  // State management
  const [showProofModal, setShowProofModal] = useState(false);
  const [showVerificationModal, setShowVerificationModal] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [coverFile, setCoverFile] = useState(null);
  const [mediaFiles, setMediaFiles] = useState([]);

  // Custom hooks
  const {
    progress,
    handleFileUpload,
    isLoading: uploadingFile,
  } = useFileUpload();

  const { data: event, isLoading: fetching } = useGetSingleEventManager({
    eventId: id,
  });
  const { isLoading: creating, createEvent } = CreateEventManager();
  const { isLoading: updating, updateEvent } = EditEventManager({});

  // Form data state
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    host: "",
    image: null,
    event_type: "",
    payment_type: "",
    venue: "",
    date: "",
    time: "",
    no_of_invitees: "",
    items: [],
    verification_type: "",
    donation: {
      account_name: "",
      bank_name: "",
      account_number: "",
    },
    gallery: [],
    pay_later: false,
  });

  // Initialize form data with event data in edit mode
  useEffect(() => {
    if (isEditMode && event) {
      setFormData(event?.data[0]);

      // Set initial step based on editSection parameter
      if (section) {
        if (section && section.toLowerCase() !== "event details") {
          setCurrentStep(0);
          return;
        }
        const stepIndex = steps.findIndex(
          (step) => step.title.toLowerCase() === section.toLowerCase()
        );

        if (stepIndex !== -1) {
          setCurrentStep(stepIndex);
        }
      }
    }
  }, [event, isEditMode, section]);

  const handleFormDataChange = (field, value) => {
    if (field === "image") {
      setCoverFile(value);
    } else if (field === "gallery") {
      // Update both states
      setMediaFiles(value);
      setFormData((prev) => ({
        ...prev,
        gallery: value,
      }));
    } else if (field.startsWith("donation.")) {
      const donationField = field.split(".")[1];
      setFormData((prev) => ({
        ...prev,
        donation: {
          ...prev.donation,
          [donationField]: value,
        },
      }));
    } else if (field === "payment_type") {
      setFormData((prev) => ({
        ...prev,
        payment_type: value,
        pay_later: value === "later",
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [field]: value,
      }));
    }
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

  // Filter steps if editing specific section
  const visibleSteps = section
    ? steps.filter(
        (step) =>
          step.title.toLowerCase() === section.toLowerCase() ||
          (step.title === "Invitation Settings" &&
            section.toLowerCase() === "event details")
      )
    : steps;

  const handleNext = () => {
    if (!validateFormSubmission(formRef, formData)) {
      return;
    }
    if (currentStep < visibleSteps.length - 1) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handleSubmit = async () => {
    try {
      const updatedFormData = { ...formData };
      updatedFormData.no_of_invitees = Number(formData.no_of_invitees);

      // Handle cover image upload
      if (coverFile) {
        const imageUrl = await handleFileUpload(coverFile);
        updatedFormData.image = imageUrl;
      }

      // Handle gallery images upload
      if (formData.gallery?.length > 0) {
        // Separate files and URLs
        const existingUrls = formData.gallery.filter(
          (item) => !(item instanceof File)
        );
        const filesToUpload = formData.gallery.filter(
          (item) => item instanceof File
        );

        // Only upload new files
        if (filesToUpload.length > 0) {
          const uploadPromises = filesToUpload.map((file) =>
            handleFileUpload(file)
          );
          const newUrls = await Promise.all(uploadPromises);
          updatedFormData.gallery = [...existingUrls, ...newUrls];
        } else {
          updatedFormData.gallery = existingUrls;
        }
      }

      // Submit form data
      if (isEditMode) {
        await updateEvent(updatedFormData);
      } else {
        await createEvent(updatedFormData);
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      // Handle error (show toast notification, etc.)
    }
  };

  if (fetching) {
    return (
      <div className="w-full h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  const isSubmitting = creating || updating || uploadingFile;

  return (
    <BaseDashboardNavigation title={isEditMode ? "Edit Event" : "Create Event"}>
      {isEditMode && <GoBackButton />}
      <div className="w-full max-w-7xl mx-auto px-4">
        <div className="w-full space-y-6 text-brandBlack">
          {!section && (
            <StepProgress
              steps={visibleSteps.map((step) => step.title)}
              currentStep={currentStep}
              onStepClick={setCurrentStep}
            />
          )}

          <form
            className="w-full"
            id="eventForm"
            ref={formRef}
            onSubmit={(e) => e.preventDefault()}
          >
            {visibleSteps[currentStep].component}

            <div className="flex justify-between mt-8">
              {visibleSteps.length > 1 && (
                <button
                  type="button"
                  onClick={handlePrevious}
                  disabled={currentStep === 0 || isSubmitting}
                  className="px-4 py-2 bg-gray-100 rounded-lg disabled:opacity-50"
                >
                  Previous
                </button>
              )}

              <button
                type="button"
                disabled={isSubmitting}
                onClick={() => {
                  if (currentStep === 2 && !section) {
                    if (formData.payment_type === "online") {
                      // Handle online payment redirect
                    } else if (formData.payment_type === "bank") {
                      setShowProofModal(true);
                    } else if (formData.payment_type === "later") {
                      handleSubmit();
                    }
                  } else if (currentStep === visibleSteps.length - 1) {
                    handleSubmit();
                  } else {
                    handleNext();
                  }
                }}
                className="px-4 py-2 bg-brandPurple text-white rounded-full disabled:opacity-50"
              >
                {isSubmitting
                  ? "Processing..."
                  : isEditMode
                  ? "Save Changes"
                  : currentStep === 2 && !section
                  ? formData.payment_type === "online"
                    ? "Proceed to payment"
                    : formData.payment_type === "bank"
                    ? "I have paid"
                    : "Save and Continue Later"
                  : currentStep === visibleSteps.length - 1
                  ? "Save"
                  : "Save"}
              </button>
            </div>
          </form>
        </div>
      </div>

      <PaymentProofModal
        isOpen={showProofModal}
        onClose={() => {
          setShowProofModal(false);
          setShowVerificationModal(true);
        }}
      />
      <VerificationModal
        isOpen={showVerificationModal}
        onClose={() => {
          setShowVerificationModal(false);
          // Handle redirect to events page
        }}
      />
    </BaseDashboardNavigation>
  );
};

export default EventPage;
