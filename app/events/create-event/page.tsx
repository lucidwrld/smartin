"use client";
import React, { useRef, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import BaseDashboardNavigation from "@/components/BaseDashboardNavigation";
import StepProgress from "@/components/StepProgress";
import { EventDetailsStep } from "@/components/events/EventDetailsStep";
import { InvitationSettingsStep } from "@/components/events/InvitationStep";

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

import useGetUserDetailsManager from "@/app/profile-settings/controllers/get_UserDetails_controller";
import usePayForEventManager from "../controllers/payForEventController";

const EventPage = () => {
  const { id, section } = getQueryParams(["id", "section"]);
  const isEditMode = Boolean(id);
  const formRef = useRef(null);
  const router = useRouter();

  // State management
  const [showProofModal, setShowProofModal] = useState(false);
  const [showVerificationModal, setShowVerificationModal] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [coverFile, setCoverFile] = useState(null);
  const [mediaFiles, setMediaFiles] = useState([]);

  const { data: userDetails } = useGetUserDetailsManager();
  const currency = userDetails?.data?.user?.currency || "USD";

  // Custom hooks
  const {
    progress,
    handleFileUpload,
    isLoading: uploadingFile,
  } = useFileUpload();
  const { data: event, isLoading: fetching } = useGetSingleEventManager({
    eventId: id,
    enabled: Boolean(id),
  });
  const {
    isLoading: creating,
    createEvent,
    data: createdEvent,
    isSuccess,
  } = CreateEventManager();
  const { postCaller: payForEvent, isLoading: paying } = usePayForEventManager({
    eventId: id,
  });
  const {
    isLoading: updating,
    updateEvent,
    isSuccess: updated,
  } = EditEventManager({
    eventId: id,
  });

  // Form data state matching exact backend structure
  const [formData, setFormData] = useState({
    // From EventDetailsStep
    name: "",
    description: "",
    event_type: "",
    venue: "",
    virtual_link: "",
    timezone: "Africa/Lagos",
    no_of_invitees: "",
    event_days: [
      {
        date: "",
        time: "",
      },
    ],
    image: null,
    logo: null,
    banner_image: null,
    video: "",
    colors: ["#6366f1", "#8b5cf6"],
    isVirtual: false,

    // From InvitationSettingsStep
    host: "",
    verification_type: "",
    event_notifications: {
      email: false,
      sms: false,
      whatsapp: false,
      voice: false,
    },
    reminder_notifications: {
      email: false,
      sms: false,
      whatsapp: false,
      voice: false,
    },
    thank_you_notifications: {
      email: false,
      sms: false,
      whatsapp: false,
      voice: false,
    },
    enable_auto_reminder: false,
    enable_auto_thank_you: false,

    // From PaymentStep
    payment_mode: "pay_per_event",
    payment_type: "",
    pay_later: false,

    // From formData defaults/user context
    currency: currency,
    showFeedback: true,
    donation: {
      account_name: "",
      bank_name: "",
      account_number: "",
    },
    items: [],
    thank_you_message: {
      image: "",
      message: "",
    },
    path: "/events/",

    // From backend example
    gallery: [],
    speakers: [],
    resources: [],
  });

  // UI-only state (not sent to backend)
  const [uiState, setUiState] = useState({
    is_multi_day: false,
    enable_invitations: false,
    enable_reminders: false,
    enable_thank_you: false,
    // Temporary fields for date/time handling
    date: "",
    time: "",
    end_date: "",
    end_time: "",
    // Temporary fields for color handling
    primary_color: "#6366f1",
    secondary_color: "#8b5cf6",
  });

  useEffect(() => {
    if (isSuccess && createdEvent?.data) {
      // Handle different payment types after successful creation
      if (formData.payment_type === "online" && createdEvent.data.checkoutUrl) {
        window.location.href = createdEvent.data.checkoutUrl;
      } else if (formData.payment_type === "bank") {
        router.replace(`/events/create-event?id=${createdEvent.data.id}`);
        setShowProofModal(true);
      } else if (formData.payment_type === "later") {
        router.push("/events");
      } else {
        // Default fallback - navigate to the event page
        router.push(`/events/${createdEvent.data.id}`);
      }
    }
  }, [isSuccess, createdEvent, formData.payment_type]);

  const isSuccessful = updated;

  useEffect(() => {
    if (isSuccessful) {
      router.push(`/events/${id}`);
    }
  }, [isSuccessful]);

  // Initialize form data with event data in edit mode
  useEffect(() => {
    if (isEditMode && event) {
      setFormData({
        ...formData,
        ...event?.data,
        // Ensure notification objects have proper structure
        event_notifications: event?.data?.event_notifications || {
          email: false,
          sms: false,
          whatsapp: false,
          voice: false,
        },
        reminder_notifications: event?.data?.reminder_notifications || {
          email: false,
          sms: false,
          whatsapp: false,
          voice: false,
        },
        thank_you_notifications: event?.data?.thank_you_notifications || {
          email: false,
          sms: false,
          whatsapp: false,
          voice: false,
        },
        // Ensure other fields have defaults
        colors: event?.data?.colors || ["#6366f1", "#8b5cf6"],
        payment_mode: event?.data?.payment_mode || "pay_per_event",
      });

      // Initialize UI state from event data
      if (event?.data?.event_days?.length > 1) {
        setUiState((prev) => ({
          ...prev,
          is_multi_day: true,
          date: event.data.event_days[0].date,
          time: event.data.event_days[0].time,
          end_date:
            event.data.event_days[event.data.event_days.length - 1].date,
          end_time:
            event.data.event_days[event.data.event_days.length - 1].time,
          primary_color: event.data.colors?.[0] || "#6366f1",
          secondary_color: event.data.colors?.[1] || "#8b5cf6",
        }));
      } else if (event?.data?.event_days?.length === 1) {
        setUiState((prev) => ({
          ...prev,
          date: event.data.event_days[0].date,
          time: event.data.event_days[0].time,
          primary_color: event.data.colors?.[0] || "#6366f1",
          secondary_color: event.data.colors?.[1] || "#8b5cf6",
        }));
      }

      if (section) {
        const stepIndex = steps.findIndex(
          (step) => step.title.toLowerCase() === section.toLowerCase()
        );
        if (stepIndex !== -1) {
          setCurrentStep(0); // Always set to 0 since we're showing only the relevant section
        }
      }
    }
  }, [event, isEditMode, section]);

  // Update event_days when date/time changes
  useEffect(() => {
    if (uiState.date && uiState.time) {
      updateEventDays();
    }
  }, [
    uiState.date,
    uiState.time,
    uiState.end_date,
    uiState.end_time,
    uiState.is_multi_day,
  ]);

  const handleFormDataChange = (field, value) => {
    // Handle UI-only state changes
    if (
      [
        "date",
        "time",
        "end_date",
        "end_time",
        "is_multi_day",
        "primary_color",
        "secondary_color",
        "enable_invitations",
        "enable_reminders",
        "enable_thank_you",
      ].includes(field)
    ) {
      setUiState((prev) => ({ ...prev, [field]: value }));

      // Update colors array when color changes
      if (field === "primary_color" || field === "secondary_color") {
        setFormData((prev) => ({
          ...prev,
          colors: [
            field === "primary_color" ? value : uiState.primary_color,
            field === "secondary_color" ? value : uiState.secondary_color,
          ],
        }));
      }
      return;
    }

    // Handle image files
    if (field === "image") {
      setCoverFile(value);
    } else if (field === "gallery") {
      setMediaFiles(value);
      setFormData((prev) => ({ ...prev, gallery: value }));
    } else if (field.startsWith("donation.")) {
      const donationField = field.split(".")[1];
      setFormData((prev) => ({
        ...prev,
        donation: { ...prev.donation, [donationField]: value },
      }));
    } else if (field === "payment_type") {
      setFormData((prev) => ({
        ...prev,
        payment_type: value,
        pay_later: value === "later" || value === "bank",
      }));
    } else if (field.startsWith("event_notifications.")) {
      const channel = field.split(".")[1];
      setFormData((prev) => ({
        ...prev,
        event_notifications: { ...prev.event_notifications, [channel]: value },
      }));
    } else if (field.startsWith("reminder_notifications.")) {
      const channel = field.split(".")[1];
      setFormData((prev) => ({
        ...prev,
        reminder_notifications: {
          ...prev.reminder_notifications,
          [channel]: value,
        },
      }));
    } else if (field.startsWith("thank_you_notifications.")) {
      const channel = field.split(".")[1];
      setFormData((prev) => ({
        ...prev,
        thank_you_notifications: {
          ...prev.thank_you_notifications,
          [channel]: value,
        },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [field]: value }));
    }
  };

  // Helper function to update event_days based on UI state
  const updateEventDays = () => {
    setTimeout(() => {
      const currentUiState = { ...uiState };

      if (
        currentUiState.is_multi_day &&
        currentUiState.date &&
        currentUiState.end_date
      ) {
        // Generate array of days for multi-day event
        const days = [];
        const startDate = new Date(currentUiState.date);
        const endDate = new Date(currentUiState.end_date);

        while (startDate <= endDate) {
          days.push({
            date: startDate.toISOString().split("T")[0],
            time:
              startDate.getTime() === new Date(currentUiState.date).getTime()
                ? currentUiState.time
                : currentUiState.end_time,
          });
          startDate.setDate(startDate.getDate() + 1);
        }

        setFormData((prev) => ({ ...prev, event_days: days }));
      } else if (currentUiState.date && currentUiState.time) {
        // Single day event
        setFormData((prev) => ({
          ...prev,
          event_days: [
            {
              date: currentUiState.date,
              time: currentUiState.time,
            },
          ],
        }));
      }
    }, 0);
  };

  // Simplified steps array - only 3 essential steps
  const steps = [
    {
      title: "Event Details",
      component: (
        <EventDetailsStep
          isEditMode={isEditMode}
          formData={formData}
          uiState={uiState}
          onFormDataChange={handleFormDataChange}
        />
      ),
    },
    {
      title: "Invitation Settings",
      component: (
        <InvitationSettingsStep
          formData={formData}
          uiState={uiState}
          onFormDataChange={handleFormDataChange}
          isEditMode={isEditMode}
        />
      ),
    },
    {
      title: "Payment",
      component: (
        <PaymentStep
          event={event?.data}
          isEditMode={isEditMode}
          formData={formData}
          uiState={uiState}
          onFormDataChange={handleFormDataChange}
          currency={currency}
        />
      ),
    },
  ];

  // Filter steps if editing specific section
  const visibleSteps = section
    ? steps.filter((step) => {
        const sectionLower = section.toLowerCase();
        // Show Invitation Settings along with Event Details in both create and edit modes
        if (sectionLower === "event details") {
          return (
            step.title === "Event Details" ||
            step.title === "Invitation Settings"
          );
        }
        return step.title.toLowerCase() === sectionLower;
      })
    : steps;

  const handleNext = () => {
    // In edit mode, skip validation when just navigating between steps
    if (!isEditMode) {
      if (!validateFormSubmission(formRef, formData)) {
        return;
      }
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

  const handlePayment = async (eventId) => {
    try {
      switch (formData.payment_type) {
        case "later":
          router.push("/events");
          break;

        case "bank":
          if (currency === "NGN") {
            setShowProofModal(true);
          }
          break;

        case "online":
          if (!isEditMode) {
            // For newly created events, redirect to checkout URL
            const checkoutUrl = createdEvent?.data?.checkoutUrl;
            if (checkoutUrl) {
              window.location.href = checkoutUrl;
            }
          } else {
            // For existing events, payForEvent handles the navigation
            await payForEvent({ path: "/events/" });
          }
          break;

        default:
          router.push(`/events/${eventId}`);
      }
    } catch (error) {
      console.error("Error processing payment:", error);
      // Handle payment error appropriately
    }
  };

  const handleFileUploads = async (formData) => {
    const updatedData = { ...formData };

    // Handle main image upload
    if (coverFile) {
      const imageUrl = await handleFileUpload(coverFile);
      updatedData.image = imageUrl;
    }

    // Handle logo upload
    if (formData.logo && typeof formData.logo === "object") {
      const logoUrl = await handleFileUpload(formData.logo);
      updatedData.logo = logoUrl;
    }

    // Handle banner upload
    if (formData.banner_image && typeof formData.banner_image === "object") {
      const bannerUrl = await handleFileUpload(formData.banner_image);
      updatedData.banner_image = bannerUrl;
    }

    // Handle gallery uploads (existing logic)
    if (formData.gallery?.length > 0) {
      const existingUrls = formData.gallery.filter(
        (item) => !(item instanceof File)
      );
      const filesToUpload = formData.gallery.filter(
        (item) => item instanceof File
      );

      if (filesToUpload.length > 0) {
        const uploadPromises = filesToUpload.map((file) =>
          handleFileUpload(file)
        );
        const newUrls = await Promise.all(uploadPromises);
        updatedData.gallery = [...existingUrls, ...newUrls];
      } else {
        updatedData.gallery = existingUrls;
      }
    }

    return updatedData;
  };

  const handleSubmit = async () => {
    try {
      // Ensure event_days is properly set before submission
      if (uiState.date && uiState.time && formData.event_days[0].date === "") {
        updateEventDays();
      }

      let updatedFormData = {
        ...formData,
        no_of_invitees: Number(formData.no_of_invitees),
        currency,
      };

      // Remove user if it exists in edit mode
      if (isEditMode && "user" in updatedFormData) {
        delete updatedFormData.user;
      }

      // Handle file uploads
      updatedFormData = await handleFileUploads(updatedFormData);

      const isPaymentSection = section?.toLowerCase() === "payment";

      if (isEditMode) {
        if (isPaymentSection) {
          await handlePayment(id);
        } else {
          await updateEvent(updatedFormData);
        }
      } else {
        // Send formData directly without transformation
        await createEvent(updatedFormData);
        const eventId = createdEvent?.data?.id || id;
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      // Handle submission error appropriately
    }
  };

  const getButtonText = () => {
    if (isSubmitting) return "Processing...";

    // For both edit and create modes when on Event Details section
    if (section?.toLowerCase() === "event details") {
      if (currentStep === 0) return "Next";
      return "Save Changes";
    }

    if (isEditMode) {
      if (section?.toLowerCase() === "payment") {
        // Add this check for online payment
        if (formData.payment_type === "online") return "Proceed to Payment";
        if (formData.payment_type === "later") return "Save and Pay Later";
        if (formData.payment_type === "bank") return "Submit Payment Proof";
      }
      return "Save Changes";
    }

    // In create mode
    if (!section) {
      // Simplified flow with 3 steps: Event Details, Invitation Settings & Form, Payment
      if (currentStep < 2) return "Next"; // Steps 0-1: Event Details, Invitation Settings & Form
      if (currentStep === 2) {
        // Payment step
        if (formData.payment_type === "later") return "Save and Pay Later";
        if (formData.payment_type === "bank") return "Submit Payment Proof";
        if (formData.payment_type === "online") return "Proceed to Payment";
      }
      return "Save";
    } else {
      // Single section flow
      if (section.toLowerCase() === "payment") {
        if (formData.payment_type === "later") return "Save and Pay Later";
        if (formData.payment_type === "bank") return "Submit Payment Proof";
        if (formData.payment_type === "online") return "Proceed to Payment";
      }
      return "Save";
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
      {isEditMode &&
        section &&
        !["payment"].includes(section.toLowerCase()) && (
          <div className="mb-3 w-full">
            <GoBackButton />
          </div>
        )}

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
              {currentStep > 0 && (
                <button
                  type="button"
                  onClick={handlePrevious}
                  disabled={isSubmitting}
                  className="px-4 py-2 bg-black rounded-full disabled:opacity-50 text-white"
                >
                  Previous
                </button>
              )}

              <button
                type="button"
                disabled={isSubmitting}
                onClick={() => {
                  // In edit mode with section-based editing
                  if (isEditMode && section) {
                    if (section?.toLowerCase() === "event details") {
                      if (currentStep === 0) {
                        // Just navigate to next step, don't submit
                        handleNext();
                      } else {
                        // On last step of event details section, save
                        handleSubmit();
                      }
                    } else {
                      // For other sections in edit mode, always save
                      handleSubmit();
                    }
                    return;
                  }

                  // In edit mode without section (full flow)
                  if (isEditMode) {
                    if (currentStep < visibleSteps.length - 1) {
                      // Just navigate to next step, don't submit
                      handleNext();
                    } else {
                      // Only submit on the last step
                      handleSubmit();
                    }
                    return;
                  }

                  // For create mode - existing logic
                  if (section?.toLowerCase() === "event details") {
                    if (currentStep < visibleSteps.length - 1) {
                      handleNext();
                    } else {
                      handleSubmit();
                    }
                    return;
                  }

                  // For other cases in create mode
                  if (currentStep === visibleSteps.length - 1) {
                    handleSubmit();
                  } else {
                    handleNext();
                  }
                }}
                className="px-4 py-2 bg-brandPurple text-white rounded-full disabled:opacity-50"
              >
                {getButtonText()}
              </button>
            </div>
          </form>
        </div>
      </div>

      <PaymentProofModal
        eventId={id}
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
          router.push(`/events/${id}`);
        }}
      />
    </BaseDashboardNavigation>
  );
};

export default EventPage;
