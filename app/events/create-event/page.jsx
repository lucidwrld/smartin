"use client";
import React, { useRef, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import BaseDashboardNavigation from "@/components/BaseDashboardNavigation";
import StepProgress from "@/components/StepProgress";
import { EventDetailsStep } from "@/components/events/EventDetailsStep";
import { InvitationSettingsStep } from "@/components/events/InvitationStep";
import { GalleryStep } from "@/components/events/GalleryStep";
import { GiftRegistryStep } from "@/components/events/GiftRegistryStep";
import { GuestListStep } from "@/components/events/GuestListStep";
import PaymentStep from "@/components/events/PaymentStep";
import { SessionsStep } from "@/components/events/SessionsStep";
import { RegistrationFormsStep } from "@/components/events/RegistrationFormsStep";
import { PaymentProofModal } from "@/components/events/PaymentProofModal";
import { VerificationModal } from "@/components/events/VerificationModal";
import { validateFormSubmission } from "@/utils/validateForm";
import { CreateEventManager } from "../controllers/createEventController";
import { EditEventManager } from "../controllers/editEventController";
import useGetSingleEventManager from "../controllers/getSingleEventController";
import { getQueryParams } from "@/utils/getQueryParams";
import useFileUpload from "@/utils/fileUploadController";
import GoBackButton from "@/components/GoBackButton";
import { shouldChargeInNaira } from "@/utils/shouldChargeInNaira";
import useGetUserDetailsManager from "@/app/profile-settings/controllers/get_UserDetails_controller";
import { AddInviteesManager } from "../controllers/addInviteesController";
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
  const {
    addInvitees,
    isLoading: adding,
    isSuccess: added,
  } = AddInviteesManager();
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

  // Enhanced form data state with new fields
  const [formData, setFormData] = useState({
    // Existing fields - UNCHANGED
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
    timezone: "Africa/Lagos",
    path: "/events/",
    donation: {
      account_name: "",
      bank_name: "",
      account_number: "",
    },
    gallery: [],
    showFeedback: true,
    pay_later: false,
    currency: currency,
    thank_you_message: {
      image: "",
      message: "",
    },

    // NEW FIELDS for enhanced functionality
    is_multi_day: false,
    end_date: "",
    end_time: "",
    video_url: "",
    logo: null,
    banner_image: null,
    primary_color: "#6366f1",
    secondary_color: "#8b5cf6",

    // Session management
    enable_sessions: false,
    sessions: [],

    // Registration forms
    enable_registration: false,
    registration_start_date: "",
    registration_end_date: "",
    registration_forms: [],

    // NEW: Invitation Settings
    enable_invitations: false,
    invitation_methods: [], // ["email", "sms", "whatsapp", "voice"]
    enable_reminders: false,

    // NEW: Payment Mode
    payment_mode: "pay_per_event", // "subscription" or "pay_per_event"

    // Ticketing (for future steps)
    enable_ticketing: false,
    tickets: [],

    // Vendors (for future steps)
    vendors: [],

    // Program/agenda (for future steps)
    program: {
      enabled: false,
      is_public: true,
      schedule: [],
      speakers: [],
    },

    // Stakeholders (for future steps)
    hosts: [],
    sponsors: [],
    partners: [],

    // Resources (for future steps)
    resources: [],
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
        router.push(`/events/event?id=${createdEvent.data.id}`);
      }
    }
  }, [isSuccess, createdEvent, formData.payment_type]);

  const isSuccessful = updated || added;

  useEffect(() => {
    if (isSuccessful) {
      router.push(`/events/event?id=${id}`);
    }
  }, [isSuccessful]);

  // Initialize form data with event data in edit mode
  useEffect(() => {
    if (isEditMode && event) {
      setFormData({
        ...formData,
        ...event?.data,
        // Ensure new fields have defaults if not present in existing data
        is_multi_day: event?.data?.is_multi_day || false,
        enable_sessions: event?.data?.enable_sessions || false,
        sessions: event?.data?.sessions || [],
        enable_registration: event?.data?.enable_registration || false,
        registration_forms: event?.data?.registration_forms || [],
        primary_color: event?.data?.primary_color || "#6366f1",
        secondary_color: event?.data?.secondary_color || "#8b5cf6",
        // New invitation fields
        enable_invitations: event?.data?.enable_invitations || false,
        invitation_methods: event?.data?.invitation_methods || [],
        enable_reminders: event?.data?.enable_reminders || false,
        payment_mode: event?.data?.payment_mode || "pay_per_event",
      });
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

  const handleFormDataChange = (field, value) => {
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
    } else {
      setFormData((prev) => ({ ...prev, [field]: value }));
    }
  };

  // Enhanced steps array with new steps
  const steps = [
    {
      title: "Event Details",
      component: (
        <EventDetailsStep
          isEditMode={isEditMode}
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
      title: "Sessions",
      component: (
        <SessionsStep
          formData={formData}
          onFormDataChange={handleFormDataChange}
        />
      ),
    },
    {
      title: "Registration Forms",
      component: (
        <RegistrationFormsStep
          formData={formData}
          onFormDataChange={handleFormDataChange}
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
          onFormDataChange={handleFormDataChange}
          currency={currency}
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
          router.push(`/events/event?id=${eventId}`);
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
        if (section?.toLowerCase() === "guest list") {
          const details = { eventId: id, invitees: formData.guestList };
          await addInvitees(details);
        } else if (isPaymentSection) {
          await handlePayment(id);
        } else {
          await updateEvent(updatedFormData);
        }
      } else {
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
      // Normal flow with all steps - Updated for new step positions
      if (currentStep < 4) return "Next"; // Steps 0-3: Event Details, Invitation, Sessions, Registration
      if (currentStep === 4) {
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

  const isSubmitting = creating || updating || uploadingFile || adding;

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
                  // For Event Details section in both modes
                  if (section?.toLowerCase() === "event details") {
                    if (currentStep < visibleSteps.length - 1) {
                      handleNext();
                    } else {
                      handleSubmit();
                    }
                    return;
                  }

                  // For other cases - Updated for new payment step position
                  if (
                    currentStep === visibleSteps.length - 1 ||
                    (currentStep === 4 && !section) // Payment is now step 4
                  ) {
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
          router.push(`/events/event?id=${id}`);
        }}
      />
    </BaseDashboardNavigation>
  );
};

export default EventPage;
