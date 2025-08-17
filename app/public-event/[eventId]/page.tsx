"use client";
import React, { useState, useEffect } from "react";
import {
  MapPin,
  Calendar,
  Clock,
  ChevronRight,
  ChevronLeft,
  Menu,
  X,
  ArrowUpRight,
  Ticket,
  Users,
  User,
  Award,
  Star,
  Camera,
  Heart,
  CheckCircle,
  Gift,
  Sun,
  Moon,
  Play,
  PlayCircle,
} from "lucide-react";
import useGetSingleEventPublicManager from "@/app/events/controllers/getSingleEventPublicController";
import useGetPublicFeedbacksManager from "@/app/events/controllers/feedbacks/getPublicFeedbacksController";
import useGetInviteByCodeManager from "@/app/events/controllers/getInviteByCodeController";
import GetEventFormsMetadataManager from "@/app/events/controllers/forms/getEventFormsMetadataController";
import GetPublicFormManager from "@/app/events/controllers/forms/getPublicFormController";

import { useParams, useRouter } from "next/navigation";
import Loader from "@/components/Loader";
import FeedbackModal from "@/components/events/publicComponents/FeedbackModal";
import TicketsSection from "@/components/events/publicComponents/TicketsSection";
import BoothsSection from "@/components/events/publicComponents/BoothsSection";
import AdvertsSection from "@/components/events/publicComponents/AdvertsSection";
import ActiveBoothsSection from "@/components/events/publicComponents/ActiveBoothsSection";
import ActiveAdvertsSection from "@/components/events/publicComponents/ActiveAdvertsSection";
import ExistingCustomerBanner from "@/components/events/publicComponents/ExistingCustomerBanner";
import useDebounce from "@/utils/UseDebounce";
import { toast } from "react-toastify";
import CreateFormSubmissionManager from "@/app/events/controllers/forms/createFormSubmissionController";

export default function ConferenceWebsite() {
  const resolvedParams = useParams();
  const eventId = resolvedParams?.eventId;
  const router = useRouter();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [accessToken, setAccessToken] = useState("");
  const [checkedIn, setCheckedIn] = useState(false);
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [showMediaModal, setShowMediaModal] = useState(false);
  const [selectedMedia, setSelectedMedia] = useState(null);
  const [showGalleryModal, setShowGalleryModal] = useState(false);
  const [selectedGalleryItem, setSelectedGalleryItem] = useState(null);
  const [galleryCurrentIndex, setGalleryCurrentIndex] = useState(0);
  const [showRegistrationForms, setShowRegistrationForms] = useState(false);
  const [currentFormIndex, setCurrentFormIndex] = useState(0);
  const [formData, setFormData] = useState({});
  const [submittedForms, setSubmittedForms] = useState(new Set());

  // Debounce the access token to avoid excessive API calls
  const debouncedAccessToken = useDebounce(accessToken, 500);

  const {
    data: eventInfo,
    isLoading: isEventInfoLoading,
    isError: isEventInfoError,
  } = useGetSingleEventPublicManager({
    eventId: eventId,
    enabled: Boolean(eventId),
  });

  const {
    data: inviteData,
    isLoading: loadingInviteData,
    isSuccess,
    isError,
    error,
    refetch,
  } = useGetInviteByCodeManager({
    code: debouncedAccessToken,
    enabled: Boolean(
      debouncedAccessToken && debouncedAccessToken.trim().length > 0
    ),
  });

  // Fetch feedback data
  const { data: feedbackData, isLoading: isFeedbackLoading } =
    useGetPublicFeedbacksManager({
      eventId: eventId,
      enabled: Boolean(eventId && eventInfo?.data?.showFeedback),
    });

  // Fetch forms metadata to check if registration is required
  const { data: formsMetadata, isLoading: isFormsMetadataLoading } =
    GetEventFormsMetadataManager({
      eventId: eventId,
      enabled: Boolean(eventId),
    });

  const [timeLeft, setTimeLeft] = useState({
    days: 5,
    hours: 12,
    minutes: 8,
    seconds: 10,
  });

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  const handleCheckIn = () => {
    if (accessToken.trim()) {
      // setCheckedIn(true);
      // Here you would typically validate the token with your backend
    }
  };

  useEffect(() => {
    if (debouncedAccessToken && isSuccess && inviteData) {
      toast.success("Invitation validated successfully! Redirecting...");
      router.push(
        `https://smartinvites.xyz/invites/?code=${debouncedAccessToken}`
      );
    } else if (debouncedAccessToken && isError) {
      toast.error(
        error?.message ||
          "Invalid invitation code. Please check your code and try again."
      );
    }
  }, [debouncedAccessToken, isSuccess, inviteData, isError, error, router]);

  useEffect(() => {
    const calculateTimeLeft = () => {
      if (!eventInfo?.data?.date)
        return { days: 0, hours: 0, minutes: 0, seconds: 0 };

      const eventDate = new Date(eventInfo.data.date);
      const now = new Date();
      const difference = eventDate.getTime() - now.getTime();

      if (difference > 0) {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor(
          (difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
        );
        const minutes = Math.floor(
          (difference % (1000 * 60 * 60)) / (1000 * 60)
        );
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);

        return { days, hours, minutes, seconds };
      }

      return { days: 0, hours: 0, minutes: 0, seconds: 0 };
    };

    // Initial calculation
    setTimeLeft(calculateTimeLeft());

    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, [eventInfo?.data?.date]);

  const themeClasses = {
    bg: isDarkMode ? "bg-[#0a0e27]" : "bg-gray-50",
    text: isDarkMode ? "text-white" : "text-gray-900",
    card: isDarkMode ? "bg-[#0d1129]" : "bg-white",
    cardBorder: isDarkMode ? "border-slate-800" : "border-gray-200",
    cardHover: isDarkMode ? "hover:border-slate-700" : "hover:border-gray-300",
    nav: isDarkMode ? "bg-[#0a0e27]/95" : "bg-white/95",
    navBorder: isDarkMode ? "border-slate-800" : "border-gray-200",
    accent: isDarkMode ? "text-slate-400" : "text-gray-600",
    sectionBg: isDarkMode ? "bg-[#0d1129]/50" : "bg-gray-100/50",
  };

  // Helper function to darken a color for hover states
  const darkenColor = (color: string, percent: number = 20) => {
    const hex = color.replace("#", "");
    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);

    const newR = Math.max(0, Math.floor(r * (1 - percent / 100)));
    const newG = Math.max(0, Math.floor(g * (1 - percent / 100)));
    const newB = Math.max(0, Math.floor(b * (1 - percent / 100)));

    return `#${newR.toString(16).padStart(2, "0")}${newG
      .toString(16)
      .padStart(2, "0")}${newB.toString(16).padStart(2, "0")}`;
  };

  const brandColors = {
    primary: eventInfo?.data?.colors?.[0] || "#F97316", // Orange fallback
    secondary: eventInfo?.data?.colors?.[1] || "#1E293B", // Navy fallback
    primaryHover: eventInfo?.data?.colors?.[0]
      ? darkenColor(eventInfo.data.colors[0], 15)
      : "#EA580C", // Darker primary
    accent: eventInfo?.data?.colors?.[1] || "#EA580C", // Secondary or orange accent
    primaryText: "text-white",
  };

  // Filter active speakers from stakeholders
  const activeSpeakers =
    eventInfo?.data?.stakeholders?.filter(
      (stakeholder) =>
        stakeholder.role === "Speaker" && stakeholder.status === "active"
    ) || [];

  // Filter public programs
  const publicPrograms =
    eventInfo?.data?.program?.filter((program) => program.is_public === true) ||
    [];

  // Gallery functions
  const openGalleryModal = (item, index) => {
    setSelectedGalleryItem(item);
    setGalleryCurrentIndex(index);
    setShowGalleryModal(true);
  };

  const closeGalleryModal = () => {
    setShowGalleryModal(false);
    setSelectedGalleryItem(null);
  };

  const goToPreviousGalleryItem = () => {
    const gallery = eventInfo?.data?.gallery || [];
    const newIndex =
      galleryCurrentIndex > 0 ? galleryCurrentIndex - 1 : gallery.length - 1;
    setGalleryCurrentIndex(newIndex);
    setSelectedGalleryItem(gallery[newIndex]);
  };

  const goToNextGalleryItem = () => {
    const gallery = eventInfo?.data?.gallery || [];
    const newIndex =
      galleryCurrentIndex < gallery.length - 1 ? galleryCurrentIndex + 1 : 0;
    setGalleryCurrentIndex(newIndex);
    setSelectedGalleryItem(gallery[newIndex]);
  };

  const isVideo = (url) =>
    url?.includes("video") || url?.endsWith(".mp4") || url?.includes(".mp4");

  // Check if event has required forms for registration
  const hasRequiredForms = formsMetadata?.data?.hasRequiredForms || false;
  const requiredForms = formsMetadata?.data?.requiredForms || [];

  // Handle registration button click
  const handleRegisterClick = () => {
    if (hasRequiredForms && requiredForms.length > 0) {
      setShowRegistrationForms(true);
      setCurrentFormIndex(0);
    }
  };

  // Get current form data
  const currentForm = requiredForms[currentFormIndex];
  const { data: currentFormData, isLoading: isFormLoading } =
    GetPublicFormManager({
      formId: currentForm?.id,
      enabled: Boolean(currentForm?.id && showRegistrationForms),
    });

  // Form submission
  const { createFormSubmission, isLoading: isSubmitting } =
    CreateFormSubmissionManager(eventId as string, currentForm?.id || "");

  // Handle form field changes
  const handleFormFieldChange = (fieldId, value) => {
    setFormData((prev) => ({
      ...prev,
      [fieldId]: value,
    }));
  };

  // Handle form submission
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!currentFormData?.data) return;

    const form = currentFormData.data;
    const responses = form.form_fields.map((field) => ({
      type: field.type,
      label: field.label,
      response: formData[field._id] || "",
    }));

    // Validate required fields
    if (!formData.name || !formData.name.trim()) {
      toast.error("Please enter your full name");
      return;
    }
    
    if (!formData.email || !formData.email.trim()) {
      toast.error("Please enter your email address");
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast.error("Please enter a valid email address");
      return;
    }

    try {
      await createFormSubmission({
        name: formData.name.trim(),
        email: formData.email.trim(),
        responses,
      });

      // Mark form as submitted
      setSubmittedForms((prev) => new Set([...prev, form._id]));

      // Move to next form or close if last form
      if (currentFormIndex < requiredForms.length - 1) {
        setCurrentFormIndex((prev) => prev + 1);
        setFormData({});
      } else {
        setShowRegistrationForms(false);
        setCurrentFormIndex(0);
        setFormData({});
        toast.success("Registration completed successfully!");
      }
    } catch (error) {
      toast.error("Failed to submit form. Please try again.");
    }
  };

  // Handle form navigation
  const handlePreviousForm = () => {
    if (currentFormIndex > 0) {
      setCurrentFormIndex((prev) => prev - 1);
    }
  };

  const handleNextForm = () => {
    if (currentFormIndex < requiredForms.length - 1) {
      setCurrentFormIndex((prev) => prev + 1);
    }
  };

  // Close registration forms
  const handleCloseRegistration = () => {
    setShowRegistrationForms(false);
    setCurrentFormIndex(0);
    setFormData({});
  };

  // Render form field based on type
  const renderFormField = (field) => {
    const isRequired = currentFormData?.data?.is_required && field.required;
    const fieldValue = formData[field._id] || "";

    switch (field.type) {
      case "text":
      case "email":
      case "phone":
        return (
          <input
            type={field.type}
            id={field._id}
            value={fieldValue}
            onChange={(e) => handleFormFieldChange(field._id, e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
            placeholder={field.placeholder}
            required={isRequired}
          />
        );
      case "textarea":
        return (
          <textarea
            id={field._id}
            value={fieldValue}
            onChange={(e) => handleFormFieldChange(field._id, e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
            placeholder={field.placeholder}
            rows={4}
            required={isRequired}
          />
        );
      case "select":
        return (
          <select
            id={field._id}
            value={fieldValue}
            onChange={(e) => handleFormFieldChange(field._id, e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
            required={isRequired}
          >
            <option value="">{field.placeholder || "Select an option"}</option>
            {field.options.map((option, idx) => (
              <option key={idx} value={option}>
                {option}
              </option>
            ))}
          </select>
        );
      case "radio":
        return (
          <div className="space-y-2">
            {field.options.map((option, idx) => (
              <label key={idx} className="flex items-center">
                <input
                  type="radio"
                  name={field._id}
                  value={option}
                  checked={fieldValue === option}
                  onChange={(e) =>
                    handleFormFieldChange(field._id, e.target.value)
                  }
                  className="mr-2 text-orange-500 focus:ring-orange-500"
                  required={isRequired}
                />
                <span className="text-gray-700">{option}</span>
              </label>
            ))}
          </div>
        );
      case "checkbox":
        return (
          <div className="space-y-2">
            {field.options.map((option, idx) => (
              <label key={idx} className="flex items-center">
                <input
                  type="checkbox"
                  value={option}
                  checked={(fieldValue || []).includes(option)}
                  onChange={(e) => {
                    const currentValues = fieldValue || [];
                    if (e.target.checked) {
                      handleFormFieldChange(field._id, [
                        ...currentValues,
                        option,
                      ]);
                    } else {
                      handleFormFieldChange(
                        field._id,
                        currentValues.filter((v) => v !== option)
                      );
                    }
                  }}
                  className="mr-2 text-orange-500 focus:ring-orange-500"
                />
                <span className="text-gray-700">{option}</span>
              </label>
            ))}
          </div>
        );
      case "date":
        return (
          <input
            type="date"
            id={field._id}
            value={fieldValue}
            onChange={(e) => handleFormFieldChange(field._id, e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
            required={isRequired}
          />
        );
      case "number":
        return (
          <input
            type="number"
            id={field._id}
            value={fieldValue}
            onChange={(e) => handleFormFieldChange(field._id, e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
            placeholder={field.placeholder}
            required={isRequired}
          />
        );
      default:
        return null;
    }
  };

  if (isEventInfoLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader />
      </div>
    );
  }

  return (
    <div
      className={`min-h-screen ${themeClasses.bg} ${themeClasses.text} relative overflow-hidden transition-colors duration-300`}
    >
      {/* Background gradient effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 via-transparent to-transparent pointer-events-none" />
      <div className="absolute right-0 top-1/4 w-96 h-96 bg-orange-500/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute left-0 bottom-1/4 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Navigation */}
      <nav
        className={`fixed top-0 w-full ${themeClasses.nav} backdrop-blur-sm z-50 border-b ${themeClasses.navBorder} transition-colors duration-300`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              {eventInfo?.data?.logo && (
                <img
                  src={eventInfo?.data?.logo}
                  alt="Event Logo"
                  className="h-8 w-auto mr-3"
                />
              )}
              <div>
                <span className="text-xl font-bold">
                  {eventInfo?.data?.name}
                </span>
              </div>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-6 text-sm">
              <a
                href="#about"
                className={`${themeClasses.accent} hover:${themeClasses.text} transition-colors`}
              >
                About
              </a>
              <a
                href="#tickets"
                className={`${themeClasses.accent} hover:${themeClasses.text} transition-colors`}
              >
                Tickets
              </a>
              <a
                href="#programs"
                className={`${themeClasses.accent} hover:${themeClasses.text} transition-colors`}
              >
                Programs
              </a>
              <a
                href="#speakers"
                className={`${themeClasses.accent} hover:${themeClasses.text} transition-colors`}
              >
                Speakers
              </a>
              <a
                href="#partners"
                className={`${themeClasses.accent} hover:${themeClasses.text} transition-colors`}
              >
                Partners
              </a>
              <a
                href="#vendors"
                className={`${themeClasses.accent} hover:${themeClasses.text} transition-colors`}
              >
                Vendors
              </a>
              <a
                href="#gallery"
                className={`${themeClasses.accent} hover:${themeClasses.text} transition-colors`}
              >
                Gallery
              </a>
              <button
                onClick={toggleTheme}
                className={`p-2 rounded-md ${themeClasses.cardBorder} border ${themeClasses.cardHover} transition-colors`}
                title="Toggle theme"
              >
                {isDarkMode ? <Sun size={16} /> : <Moon size={16} />}
              </button>
              {hasRequiredForms && (
                <button
                  onClick={handleRegisterClick}
                  className="px-4 py-2 rounded-md font-medium transition-colors text-white"
                  style={{
                    backgroundColor: brandColors.primary,
                    "&:hover": { backgroundColor: brandColors.secondary },
                  }}
                  onMouseEnter={(e) =>
                    (e.target.style.backgroundColor = brandColors.secondary)
                  }
                  onMouseLeave={(e) =>
                    (e.target.style.backgroundColor = brandColors.primary)
                  }
                >
                  Register Now
                </button>
              )}
            </div>

            {/* Mobile menu button and theme toggle */}
            <div className="flex items-center space-x-2 lg:hidden">
              <button
                onClick={toggleTheme}
                className={`p-2 rounded-md ${themeClasses.cardBorder} border ${themeClasses.cardHover} transition-colors`}
                title="Toggle theme"
              >
                {isDarkMode ? <Sun size={16} /> : <Moon size={16} />}
              </button>
              <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
                {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-[10%] pb-16 px-4 sm:px-6 lg:px-8 relative">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <div
                className="text-sm mb-4 font-medium"
                style={{ color: brandColors.primary }}
              >
                {eventInfo?.data?.host}
              </div>
              <h1 className="text-5xl lg:text-7xl font-bold mb-6 leading-tight">
                {eventInfo?.data?.name}
              </h1>
              <div className="space-y-3 mb-8">
                <div className={`flex items-center ${themeClasses.accent}`}>
                  <Calendar className="mr-3" size={20} />
                  <span>
                    {eventInfo?.data?.event_days &&
                    eventInfo.data.event_days.length > 1
                      ? `Starts ${new Date(
                          eventInfo.data.date
                        ).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}`
                      : new Date(
                          eventInfo?.data?.date || ""
                        ).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                  </span>
                </div>
                <div className={`flex items-center ${themeClasses.accent}`}>
                  <Clock className="mr-3" size={20} />
                  <span>{eventInfo?.data?.time || ""}</span>
                </div>
                <div className={`flex items-center ${themeClasses.accent}`}>
                  <MapPin className="mr-3" size={20} />
                  <span>{eventInfo?.data?.venue || ""}</span>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                {hasRequiredForms && (
                  <button
                    onClick={handleRegisterClick}
                    className="px-8 py-3 rounded-md font-medium text-lg transition-all text-white"
                    style={{
                      backgroundColor: brandColors.primary,
                      boxShadow: `0 10px 25px ${brandColors.primary}25`,
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.backgroundColor = brandColors.secondary;
                      e.target.style.boxShadow = `0 15px 35px ${brandColors.secondary}25`;
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.backgroundColor = brandColors.primary;
                      e.target.style.boxShadow = `0 10px 25px ${brandColors.primary}25`;
                    }}
                  >
                    Register Now
                  </button>
                )}
                {eventInfo?.data?.video && (
                  <button
                    className="flex items-center space-x-2 px-6 py-3 border rounded-md transition-colors"
                    style={{
                      borderColor: brandColors.primary,
                      color: brandColors.primary,
                    }}
                    onMouseEnter={(e) => {
                      (e.target as HTMLButtonElement).style.backgroundColor =
                        brandColors.primary;
                      (e.target as HTMLButtonElement).style.color = "white";
                    }}
                    onMouseLeave={(e) => {
                      (e.target as HTMLButtonElement).style.backgroundColor =
                        "transparent";
                      (e.target as HTMLButtonElement).style.color =
                        brandColors.primary;
                    }}
                    onClick={() => setShowVideoModal(true)}
                  >
                    <PlayCircle size={20} />
                    <span>Watch Intro</span>
                  </button>
                )}
              </div>
            </div>
            <div className="relative">
              {/* Event Image */}
              {eventInfo?.data?.image && (
                <img
                  src={eventInfo?.data?.image}
                  alt={eventInfo.data.name || "Event"}
                  className="rounded-lg w-full object-cover h-80"
                />
              )}

              {/* Commented out original image grid */}
              {/* <div className="grid grid-cols-2 gap-4">
                <img
                  src="https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=300&h=200&fit=crop"
                  alt="Conference"
                  className="rounded-lg w-full object-cover h-40"
                />
                <img
                  src="https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=300&h=200&fit=crop"
                  alt="Speakers"
                  className="rounded-lg w-full object-cover h-40"
                />
                <img
                  src="https://images.unsplash.com/photo-1511578314322-379afb476865?w=300&h=200&fit=crop"
                  alt="Networking"
                  className="rounded-lg w-full object-cover h-40"
                />
                <img
                  src="https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=300&h=200&fit=crop"
                  alt="Workshop"
                  className="rounded-lg w-full object-cover h-40"
                />
              </div> */}

              {/* Center play button overlay */}
              {eventInfo?.data?.video && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <button
                    className="rounded-full p-6 transition-all hover:scale-110 backdrop-blur-sm"
                    style={{
                      backgroundColor: `${brandColors.primary}90`,
                    }}
                    onMouseEnter={(e) =>
                      ((e.target as HTMLButtonElement).style.backgroundColor =
                        brandColors.primary)
                    }
                    onMouseLeave={(e) =>
                      ((
                        e.target as HTMLButtonElement
                      ).style.backgroundColor = `${brandColors.primary}90`)
                    }
                    onClick={() => setShowVideoModal(true)}
                  >
                    <Play
                      className="text-white ml-1"
                      size={32}
                      fill="currentColor"
                    />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Event Info Section with Countdown */}
      <section id="event-info" className="py-16 px-4 sm:px-6 lg:px-8 relative">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl lg:text-5xl font-bold text-center mb-12 leading-tight">
            Get The Latest Info
            <br />
            About The Event
          </h2>

          {/* Event Details Cards */}
          <div className="grid md:grid-cols-2 gap-4 max-w-4xl mx-auto mb-8">
            <div className="bg-[#0d1129] border border-slate-800 rounded-lg p-4 flex items-center">
              <Calendar className="mr-3 text-orange-500" size={24} />
              <div>
                <p className="text-sm text-slate-400">Event Date</p>
                <p className="font-medium">
                  {eventInfo?.data?.event_days &&
                  eventInfo.data.event_days.length > 1
                    ? `${new Date(eventInfo.data.date).toLocaleDateString(
                        "en-US",
                        {
                          month: "short",
                          day: "numeric",
                        }
                      )} - ${new Date(
                        eventInfo.data.event_days[
                          eventInfo.data.event_days.length - 1
                        ].date
                      ).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}`
                    : eventInfo?.data?.date
                    ? new Date(eventInfo.data.date).toLocaleDateString(
                        "en-US",
                        {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        }
                      )
                    : "TBD"}
                </p>
              </div>
            </div>
            <div className="bg-[#0d1129] border border-slate-800 rounded-lg p-4 flex items-center">
              <MapPin className="mr-3 text-orange-500" size={24} />
              <div>
                <p className="text-sm text-slate-400">Event Location</p>
                <p className="font-medium">
                  {eventInfo?.data?.venue || "Venue TBD"}
                </p>
              </div>
            </div>
          </div>

          {/* Countdown Timer with torn ticket design */}
          <div className="relative max-w-4xl mx-auto">
            <div
              className="rounded-lg relative overflow-hidden"
              style={{ backgroundColor: brandColors.primary }}
            >
              {/* Torn ticket effect */}
              <div
                className={`absolute left-0 top-0 bottom-0 w-8 ${themeClasses.bg} rounded-r-full -ml-4`}
              ></div>
              <div
                className={`absolute right-0 top-0 bottom-0 w-8 ${themeClasses.bg} rounded-l-full -mr-4`}
              ></div>

              <div className="flex justify-around py-8 px-12">
                {[
                  {
                    value: timeLeft.days.toString().padStart(2, "0"),
                    label: "Days",
                  },
                  {
                    value: timeLeft.hours.toString().padStart(2, "0"),
                    label: "Hours",
                  },
                  {
                    value: timeLeft.minutes.toString().padStart(2, "0"),
                    label: "Minutes",
                  },
                  {
                    value: timeLeft.seconds.toString().padStart(2, "0"),
                    label: "Seconds",
                  },
                ].map((item, idx) => (
                  <div key={idx} className="text-center relative">
                    {idx > 0 && (
                      <div
                        className="absolute -left-8 top-1/2 -translate-y-1/2 h-12 w-px"
                        style={{ backgroundColor: brandColors.secondary }}
                      ></div>
                    )}
                    <div className="text-5xl font-bold text-white mb-1">
                      {item.value}
                    </div>
                    <div className="text-sm text-white/80">{item.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Check-In Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl lg:text-5xl font-bold text-center mb-4">
            Event Check-In
          </h2>
          <p
            className={`text-center ${themeClasses.accent} mb-12 max-w-2xl mx-auto`}
          >
            Confirm your attendance by entering your access token below
          </p>

          {!checkedIn ? (
            <div
              className={`${themeClasses.card} border ${themeClasses.cardBorder} rounded-lg p-8 max-w-md mx-auto`}
            >
              <div className="mb-6">
                <label
                  htmlFor="accessToken"
                  className="block text-sm font-medium mb-2"
                >
                  Access Token
                </label>
                <input
                  type="text"
                  id="accessToken"
                  value={accessToken}
                  onChange={(e) => setAccessToken(e.target.value)}
                  placeholder="Enter your access token"
                  className={`w-full px-4 py-3 border ${themeClasses.cardBorder} rounded-md focus:outline-none focus:ring-2 transition-colors ${themeClasses.card} ${themeClasses.text}`}
                  style={{
                    "&:focus": {
                      borderColor: brandColors.primary,
                      ringColor: `${brandColors.primary}20`,
                    },
                  }}
                />
              </div>
              <button
                onClick={handleCheckIn}
                disabled={!accessToken.trim() || loadingInviteData}
                className="w-full py-3 rounded-md font-medium transition-colors text-white disabled:opacity-50 disabled:cursor-not-allowed"
                style={{
                  backgroundColor: accessToken.trim()
                    ? brandColors.primary
                    : "#9CA3AF",
                }}
                onMouseEnter={(e) => {
                  if (accessToken.trim()) {
                    e.target.style.backgroundColor = brandColors.secondary;
                  }
                }}
                onMouseLeave={(e) => {
                  if (accessToken.trim()) {
                    e.target.style.backgroundColor = brandColors.primary;
                  }
                }}
              >
                {loadingInviteData ? `checking...` : `Check In`}
              </button>
            </div>
          ) : (
            <div
              className={`${themeClasses.card} border rounded-lg p-8 max-w-md mx-auto`}
              style={{ borderColor: "#10B981" }}
            >
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="text-green-500" size={32} />
                </div>
                <h3
                  className="text-xl font-semibold mb-2"
                  style={{ color: "#10B981" }}
                >
                  Successfully Checked In!
                </h3>
                <p className={`${themeClasses.accent} text-sm`}>
                  Welcome to {eventInfo?.data?.name}. We're excited to have you
                  with us!
                </p>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* What to Expect Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-[#0d1129]/50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl lg:text-5xl font-bold text-center mb-12 leading-tight">
            What To Expect From
            <br />
            This Event?
          </h2>
          <div
            className={`${
              eventInfo?.data?.image
                ? "grid md:grid-cols-2 gap-12 items-center"
                : "max-w-4xl mx-auto text-center"
            }`}
          >
            <div className={`${!eventInfo?.data?.image ? "mx-auto" : ""}`}>
              {eventInfo?.data?.description && (
                <div className="text-slate-300 leading-relaxed whitespace-pre-line">
                  {eventInfo.data.description}
                </div>
              )}
            </div>
            {eventInfo?.data?.image && (
              <div className="relative group cursor-pointer">
                <img
                  src={eventInfo.data.image}
                  alt="Event Preview"
                  className="rounded-lg w-full"
                />
                {eventInfo?.data?.video && (
                  <div
                    className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-lg transition-opacity group-hover:bg-black/60"
                    onClick={() => setShowVideoModal(true)}
                  >
                    <div className="bg-orange-500 rounded-full p-6 group-hover:scale-110 transition-transform">
                      <Play
                        size={32}
                        className="ml-1 text-white"
                        fill="currentColor"
                      />
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Speakers Section - Only show if there are active speakers */}
      {activeSpeakers.length > 0 && (
        <section id="speakers" className="py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-4xl lg:text-5xl font-bold text-center mb-4">
              Speakers
            </h2>
            <p className="text-center text-slate-400 mb-12 max-w-2xl mx-auto">
              Meet our distinguished speakers who will be sharing their
              expertise
            </p>

            <div className="space-y-8 max-w-6xl mx-auto">
              {activeSpeakers.map((speaker, idx) => (
                <div
                  key={speaker._id || idx}
                  className={`flex items-center gap-6 ${
                    idx % 2 === 0 ? "md:ml-0 md:mr-32" : "md:ml-32 md:mr-0"
                  }`}
                >
                  <div className="w-32 h-32 rounded-lg bg-slate-800 flex items-center justify-center text-slate-400 flex-shrink-0">
                    <Users size={48} />
                  </div>
                  <div className="bg-[#0d1129] border border-slate-800 rounded-lg p-6 flex-1 hover:border-slate-700 transition-colors">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="text-xl font-semibold mb-1">
                          {speaker.name}
                        </h3>
                        <p className="text-orange-500 text-sm mb-2">
                          {speaker.title}
                        </p>
                        <p className="text-slate-400 text-sm mb-3">
                          {speaker.organization}
                        </p>
                        <p className="text-slate-400 text-sm">
                          {speaker.expertise}
                        </p>
                      </div>
                      <div className="w-10 h-10 rounded-full border-2 border-orange-500 flex items-center justify-center text-orange-500 hover:bg-orange-500 hover:text-white transition-colors cursor-pointer ml-4 flex-shrink-0">
                        <ArrowUpRight size={16} />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Existing Customer Banner */}
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <ExistingCustomerBanner eventId={eventId} />
        </div>
      </div>

      {/* Tickets Section */}
      <TicketsSection eventId={eventId} />

      {/* Booths Section */}
      <BoothsSection eventId={eventId} />

      {/* Adverts Section */}
      <AdvertsSection eventId={eventId} />

      {/* Active Booths Section */}
      <ActiveBoothsSection eventId={eventId} />

      {/* Active Adverts Section */}
      <ActiveAdvertsSection eventId={eventId} />

      {/* About Section */}
      {/* <section
        id="about"
        className={`py-16 px-4 sm:px-6 lg:px-8 ${themeClasses.sectionBg}`}
      >
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl lg:text-5xl font-bold text-center mb-4">
            About The Event
          </h2>
          <p
            className={`text-center ${themeClasses.accent} mb-12 max-w-3xl mx-auto`}
          >
            The Asian Technology Conference brings together visionaries,
            innovators, and industry leaders to explore cutting-edge
            technologies shaping our future.
          </p>
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-2xl font-bold mb-6 text-orange-500">
                Why Attend?
              </h3>
              <div className="space-y-4">
                <div className="flex items-start">
                  <CheckCircle
                    className="text-orange-500 mr-3 mt-1 flex-shrink-0"
                    size={20}
                  />
                  <div>
                    <h4 className="font-semibold mb-1">World-Class Speakers</h4>
                    <p className={`${themeClasses.accent} text-sm`}>
                      Learn from industry pioneers and thought leaders
                    </p>
                  </div>
                </div>
                <div className="flex items-start">
                  <CheckCircle
                    className="text-orange-500 mr-3 mt-1 flex-shrink-0"
                    size={20}
                  />
                  <div>
                    <h4 className="font-semibold mb-1">
                      Networking Opportunities
                    </h4>
                    <p className={`${themeClasses.accent} text-sm`}>
                      Connect with professionals from across Asia
                    </p>
                  </div>
                </div>
                <div className="flex items-start">
                  <CheckCircle
                    className="text-orange-500 mr-3 mt-1 flex-shrink-0"
                    size={20}
                  />
                  <div>
                    <h4 className="font-semibold mb-1">Latest Technologies</h4>
                    <p className={`${themeClasses.accent} text-sm`}>
                      Discover emerging trends and innovations
                    </p>
                  </div>
                </div>
                <div className="flex items-start">
                  <CheckCircle
                    className="text-orange-500 mr-3 mt-1 flex-shrink-0"
                    size={20}
                  />
                  <div>
                    <h4 className="font-semibold mb-1">Hands-on Workshops</h4>
                    <p className={`${themeClasses.accent} text-sm`}>
                      Practical sessions with industry experts
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div
              className={`${themeClasses.card} border ${themeClasses.cardBorder} rounded-lg p-8`}
            >
              <h3 className="text-xl font-bold mb-6">Event Statistics</h3>
              <div className="grid grid-cols-2 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-orange-500 mb-1">
                    500+
                  </div>
                  <div className={`text-sm ${themeClasses.accent}`}>
                    Attendees
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-orange-500 mb-1">
                    50+
                  </div>
                  <div className={`text-sm ${themeClasses.accent}`}>
                    Speakers
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-orange-500 mb-1">
                    15+
                  </div>
                  <div className={`text-sm ${themeClasses.accent}`}>
                    Sessions
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-orange-500 mb-1">
                    3
                  </div>
                  <div className={`text-sm ${themeClasses.accent}`}>Days</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section> */}

      {/* Tickets Section */}
      {/* <section id="tickets" className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl lg:text-5xl font-bold text-center mb-4">
            Event Tickets
          </h2>
          <p className="text-center text-slate-400 mb-12 max-w-2xl mx-auto">
            Choose the perfect ticket package for your needs. Early bird pricing
            available for a limited time.
          </p>
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {tickets.map((ticket, idx) => (
              <div
                key={idx}
                className={`relative bg-[#0d1129] border rounded-lg p-8 hover:border-slate-700 transition-all hover:scale-105 ${
                  ticket.popular
                    ? "border-orange-500 ring-2 ring-orange-500/20"
                    : "border-slate-800"
                }`}
              >
                {ticket.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-orange-500 text-white px-4 py-1 rounded-full text-sm font-medium">
                    Most Popular
                  </div>
                )}
                <div className="text-center">
                  <h3 className="text-2xl font-bold mb-2">{ticket.name}</h3>
                  <p className="text-slate-400 mb-6">{ticket.description}</p>
                  <div className="mb-6">
                    <span className="text-4xl font-bold text-orange-500">
                      {ticket.price}
                    </span>
                    <span className="text-slate-400 line-through ml-2">
                      {ticket.originalPrice}
                    </span>
                  </div>
                  <ul className="space-y-3 mb-8">
                    {ticket.features.map((feature, featureIdx) => (
                      <li
                        key={featureIdx}
                        className="flex items-center text-sm"
                      >
                        <CheckCircle
                          className="text-orange-500 mr-2 flex-shrink-0"
                          size={16}
                        />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <button
                    className={`w-full py-3 rounded-md font-medium transition-colors ${
                      ticket.popular
                        ? "bg-orange-500 hover:bg-orange-600 text-white"
                        : "bg-slate-800 hover:bg-slate-700 text-white"
                    }`}
                  >
                    <Ticket className="inline mr-2" size={16} />
                    Buy Now
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section> */}

      {/* Programs/Schedule Section - Only show if there are public programs */}
      {publicPrograms.length > 0 && (
        <section
          id="programs"
          className="py-16 px-4 sm:px-6 lg:px-8 bg-[#0d1129]/50"
        >
          <div className="max-w-7xl mx-auto">
            <h2 className="text-4xl lg:text-5xl font-bold text-center mb-4">
              Event Programs
            </h2>
            <p className="text-center text-slate-400 mb-12 max-w-2xl mx-auto">
              A comprehensive schedule of keynotes, sessions, and networking
              opportunities
            </p>
            <div className="max-w-4xl mx-auto">
              <div className="space-y-6">
                {publicPrograms.map((program, idx) => (
                  <div
                    key={program._id || idx}
                    className="flex items-start gap-6 p-6 rounded-lg border transition-colors hover:border-slate-700 bg-[#0d1129] border-slate-800"
                  >
                    <div className="flex-shrink-0 text-right">
                      <div className="text-orange-500 font-bold text-lg">
                        {program.start_time}
                      </div>
                      {program.end_time && (
                        <div className="text-slate-400 text-sm">
                          - {program.end_time}
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold mb-1">
                        {program.description}
                      </h3>
                      {program.speaker && (
                        <p className="text-orange-500 text-sm mb-2">
                          Speaker: {program.speaker}
                        </p>
                      )}
                      {program.speaker_title && (
                        <p className="text-slate-400 text-sm mb-2">
                          {program.speaker_title}
                        </p>
                      )}
                      {program.location && (
                        <p className="text-slate-400 text-sm">
                          Location: {program.location}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Partners Section - Only show if there are partners */}
      {eventInfo?.data?.partners && eventInfo.data.partners.length > 0 && (
        <section id="partners" className="py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-4xl lg:text-5xl font-bold text-center mb-4">
              Our Partners
            </h2>
            <p className="text-center text-slate-400 mb-12 max-w-2xl mx-auto">
              Proud to collaborate with industry leaders and innovative
              organizations
            </p>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {eventInfo.data.partners.map((partner, idx) => (
                <div
                  key={partner._id || idx}
                  className="bg-[#0d1129] border border-slate-800 rounded-lg p-6 hover:border-slate-700 transition-colors group"
                >
                  <div className="h-20 mb-4 flex items-center justify-center">
                    {partner.logo ? (
                      <img
                        src={partner.logo}
                        alt={partner.name}
                        className="max-h-full max-w-full object-contain grayscale group-hover:grayscale-0 transition-all"
                      />
                    ) : (
                      <div className="w-16 h-16 bg-slate-800 rounded-lg flex items-center justify-center">
                        <span className="text-2xl font-bold text-slate-400">
                          {partner.name?.charAt(0)}
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="text-center">
                    {partner.sponsorship_tier && (
                      <span
                        className={`inline-block px-2 py-1 rounded text-xs font-medium mb-2 ${
                          partner.sponsorship_tier === "Platinum"
                            ? "bg-gray-100 text-gray-800"
                            : partner.sponsorship_tier === "Gold"
                            ? "bg-yellow-100 text-yellow-800"
                            : partner.sponsorship_tier === "Silver"
                            ? "bg-gray-300 text-gray-800"
                            : "bg-slate-600 text-slate-100"
                        }`}
                      >
                        {partner.sponsorship_tier}
                      </span>
                    )}
                    <h3 className="font-semibold mb-2">{partner.name}</h3>
                    {partner.description && (
                      <p className="text-slate-400 text-sm">
                        {partner.description}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Vendors/Exhibitors Section - Only show if there are vendors */}
      {eventInfo?.data?.vendors && eventInfo.data.vendors.length > 0 && (
        <section
          id="vendors"
          className="py-16 px-4 sm:px-6 lg:px-8 bg-[#0d1129]/50"
        >
          <div className="max-w-7xl mx-auto">
            <h2 className="text-4xl lg:text-5xl font-bold text-center mb-4">
              Exhibitors & Vendors
            </h2>
            <p className="text-center text-slate-400 mb-12 max-w-2xl mx-auto">
              Discover innovative products and services from our event vendors
            </p>
            <div className="grid md:grid-cols-3 gap-8">
              {eventInfo.data.vendors.map((vendor, idx) => (
                <div
                  key={vendor._id || idx}
                  className="bg-[#0d1129] border border-slate-800 rounded-lg overflow-hidden hover:border-slate-700 transition-colors group"
                >
                  {/* Vendor logo section commented out - vendors don't have pictures */}
                  {/* 
                  <div className="h-48 overflow-hidden bg-slate-800 flex items-center justify-center">
                    <div className="text-slate-400 text-center">
                      <Users size={48} className="mx-auto mb-2" />
                      <p className="text-sm">{vendor?.job_description}</p>
                    </div>
                  </div>
                  */}
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-xl font-semibold">{vendor?.name}</h3>
                      <span className="bg-orange-500/20 text-orange-500 px-2 py-1 rounded text-sm font-medium">
                        {vendor?.company}
                      </span>
                    </div>
                    <p className="text-orange-500 text-sm mb-2">
                      {vendor?.job_description}
                    </p>
                    <p className="text-slate-400 text-sm mb-4">
                      {vendor?.services_provided}
                    </p>
                    {/* Website link - clickable if vendor has website */}
                    {vendor?.website && (
                      <a
                        href={vendor.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-orange-500 hover:text-orange-400 transition-colors text-sm"
                      >
                        <ArrowUpRight className="w-4 h-4" />
                        Visit Website
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Team Section */}
      {/* <section id="team" className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl lg:text-5xl font-bold text-center mb-4">
            Meet Our Team
          </h2>
          <p className="text-center text-slate-400 mb-12 max-w-2xl mx-auto">
            The dedicated professionals behind this amazing event
          </p>
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {team.map((member, idx) => (
              <div key={idx} className="text-center group">
                <div className="relative mb-6">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-32 h-32 rounded-full mx-auto object-cover grayscale group-hover:grayscale-0 transition-all"
                  />
                  <div className="absolute inset-0 bg-orange-500/20 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
                </div>
                <h3 className="text-xl font-semibold mb-1">{member.name}</h3>
                <p className="text-orange-500 text-sm mb-3">{member.role}</p>
                <p className="text-slate-400 text-sm">{member.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </section> */}

      {/* Gallery Section - Only show if there are gallery images */}
      {eventInfo?.data?.gallery && eventInfo.data.gallery.length > 0 && (
        <section
          id="gallery"
          className="py-16 px-4 sm:px-6 lg:px-8 bg-[#0d1129]/50"
        >
          <div className="max-w-7xl mx-auto">
            <h2 className="text-4xl lg:text-5xl font-bold text-center mb-4">
              Event Gallery
            </h2>
            <p className="text-center text-slate-400 mb-12 max-w-2xl mx-auto">
              Highlights from previous events and behind-the-scenes moments
            </p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {eventInfo.data.gallery.map((item, idx) => (
                <div
                  key={idx}
                  className="relative group cursor-pointer overflow-hidden rounded-lg"
                  onClick={() => openGalleryModal(item, idx)}
                >
                  {isVideo(item) ? (
                    <div className="relative">
                      <video
                        src={item}
                        className="w-full h-64 object-cover"
                        muted
                        playsInline
                      />
                      <div className="absolute inset-0 bg-black/30 group-hover:bg-black/50 transition-colors flex items-center justify-center">
                        <div className="bg-white/20 backdrop-blur-sm rounded-full p-4">
                          <Play
                            className="w-8 h-8 text-white"
                            fill="currentColor"
                          />
                        </div>
                      </div>
                    </div>
                  ) : (
                    <>
                      <img
                        src={item}
                        alt={`Gallery ${idx + 1}`}
                        className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-colors flex items-center justify-center">
                        <Camera
                          className="text-white opacity-0 group-hover:opacity-100 transition-opacity"
                          size={32}
                        />
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Special Figures - Only show if there are hosts */}
      {eventInfo?.data?.hosts && eventInfo.data.hosts.length > 0 && (
        <section id="keynote" className="py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-4xl lg:text-5xl font-bold text-center mb-4">
              Special Figures
            </h2>
            <p className="text-center text-slate-400 mb-12 max-w-2xl mx-auto">
              Distinguished individuals sharing their insights and vision
            </p>
            <div className="max-w-4xl mx-auto space-y-6">
              {eventInfo.data.hosts.map((host, idx) => (
                <div
                  key={host._id || idx}
                  className="bg-gradient-to-r from-orange-500/10 to-transparent border border-orange-500/30 rounded-lg p-8"
                >
                  <div className="flex items-center gap-8">
                    {host.profile_image ? (
                      <img
                        src={host.profile_image}
                        alt={host.name}
                        className="w-24 h-24 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-24 h-24 rounded-full bg-slate-800 flex items-center justify-center">
                        <Users className="text-slate-400" size={32} />
                      </div>
                    )}
                    <div className="flex-1">
                      <h3 className="text-2xl font-bold mb-2">{host.name}</h3>
                      <p className="text-orange-500 mb-2">
                        {host.title}
                        {host.organization && `, ${host.organization}`}
                      </p>
                      {host.description && (
                        <p className="text-slate-400 mb-3">
                          {host.description}
                        </p>
                      )}
                      {host.areas_of_expertise && (
                        <p className="text-slate-400 mb-3">
                          Expertise: {host.areas_of_expertise}
                        </p>
                      )}
                      {/* Social Media Links */}
                      <div className="flex gap-3">
                        {host.website && (
                          <a
                            href={host.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-orange-500 hover:text-orange-400"
                          >
                            <ArrowUpRight size={16} />
                          </a>
                        )}
                        {host.linkedin && (
                          <a
                            href={host.linkedin}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-orange-500 hover:text-orange-400"
                          >
                            <ArrowUpRight size={16} />
                          </a>
                        )}
                        {host.twitter && (
                          <a
                            href={host.twitter}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-orange-500 hover:text-orange-400"
                          >
                            <ArrowUpRight size={16} />
                          </a>
                        )}
                        {host.instagram && (
                          <a
                            href={host.instagram}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-orange-500 hover:text-orange-400"
                          >
                            <ArrowUpRight size={16} />
                          </a>
                        )}
                      </div>
                    </div>
                    <Award className="text-orange-500" size={32} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Registry Section */}
      {((eventInfo?.data?.items && eventInfo.data.items.length > 0) ||
        (eventInfo?.data?.donation &&
          (eventInfo.data.donation.account_name ||
            eventInfo.data.donation.bank_name ||
            eventInfo.data.donation.account_number))) && (
        <section
          id="registry"
          className={`py-16 px-4 sm:px-6 lg:px-8 ${themeClasses.sectionBg}`}
        >
          <div className="max-w-7xl mx-auto">
            <h2 className="text-4xl lg:text-5xl font-bold text-center mb-4">
              Event Registry
            </h2>
            <p
              className={`text-center ${themeClasses.accent} mb-12 max-w-3xl mx-auto`}
            >
              Purchase items from our registry or contribute directly using the
              account details below
            </p>

            <div className="grid lg:grid-cols-3 gap-8">
              {/* Registry Items */}
              {eventInfo?.data?.items && eventInfo.data.items.length > 0 && (
                <div className="lg:col-span-2">
                  <h3 className="text-2xl font-bold mb-6">Registry Items</h3>
                  <div className="grid md:grid-cols-2 gap-6">
                    {eventInfo?.data?.items?.map((item, idx) => (
                      <div
                        key={item._id || idx}
                        className={`${themeClasses.card} border ${themeClasses.cardBorder} rounded-lg p-6 ${themeClasses.cardHover} transition-colors`}
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <h4 className="font-semibold mb-1">{item.name}</h4>
                            {/* <p className={`${themeClasses.accent} text-sm mb-2`}>
                          {item.description}
                        </p>
                        <span
                          className="inline-block px-2 py-1 text-xs rounded-full"
                          style={{
                            backgroundColor: `${brandColors.primary}20`,
                            color: brandColors.primary,
                          }}
                        >
                          {item.category}
                        </span> */}
                          </div>
                          <div className="text-right ml-4">
                            <div
                              className="text-lg font-bold"
                              style={{ color: brandColors.primary }}
                            >
                              {item?.price}
                            </div>
                          </div>
                        </div>
                        <a
                          href={item.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block w-full py-2 px-4 text-center rounded-md font-medium transition-colors text-white"
                          style={{ backgroundColor: brandColors.primary }}
                          onMouseEnter={(e) =>
                            (e.target.style.backgroundColor =
                              brandColors.secondary)
                          }
                          onMouseLeave={(e) =>
                            (e.target.style.backgroundColor =
                              brandColors.primary)
                          }
                        >
                          Purchase
                        </a>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Account Details */}
              {eventInfo?.data?.donation &&
                (eventInfo.data.donation.account_name ||
                  eventInfo.data.donation.bank_name ||
                  eventInfo.data.donation.account_number) && (
                  <div className="lg:col-span-1">
                    <h3 className="text-2xl font-bold mb-6">
                      Direct Contribution
                    </h3>
                    <div
                      className={`${themeClasses.card} border ${themeClasses.cardBorder} rounded-lg p-6 sticky top-24`}
                    >
                      <h4 className="font-semibold mb-4">Account Details</h4>
                      <div className="space-y-4 text-sm">
                        <div>
                          <span
                            className={`block ${themeClasses.accent} text-xs uppercase tracking-wide mb-1`}
                          >
                            Bank Name
                          </span>
                          <span className="font-medium">
                            {eventInfo?.data?.donation?.bank_name}
                          </span>
                        </div>
                        <div>
                          <span
                            className={`block ${themeClasses.accent} text-xs uppercase tracking-wide mb-1`}
                          >
                            Account Name
                          </span>
                          <span className="font-medium">
                            {eventInfo?.data?.donation?.account_name}
                          </span>
                        </div>
                        <div>
                          <span
                            className={`block ${themeClasses.accent} text-xs uppercase tracking-wide mb-1`}
                          >
                            Account Number
                          </span>
                          <span className="font-medium font-mono">
                            {eventInfo?.data?.donation?.account_number}
                          </span>
                        </div>
                        {/* <div>
                    <span
                      className={`block ${themeClasses.accent} text-xs uppercase tracking-wide mb-1`}
                    >
                      Routing Number
                    </span>
                    <span className="font-medium font-mono">
                      {accountDetails.routingNumber}
                    </span>
                  </div>
                  <hr className={`border-t ${themeClasses.cardBorder}`} />
                  <div>
                    <span
                      className={`block ${themeClasses.accent} text-xs uppercase tracking-wide mb-1`}
                    >
                      PayPal
                    </span>
                    <span className="font-medium">{accountDetails.paypal}</span>
                  </div>
                  <div>
                    <span
                      className={`block ${themeClasses.accent} text-xs uppercase tracking-wide mb-1`}
                    >
                      Venmo
                    </span>
                    <span className="font-medium">{accountDetails.venmo}</span>
                  </div> */}
                      </div>

                      <div
                        className="mt-6 p-4 rounded-lg"
                        style={{ backgroundColor: `${brandColors.primary}10` }}
                      >
                        <p className={`text-sm ${themeClasses.accent}`}>
                          <Gift
                            className="inline mr-2"
                            size={16}
                            style={{ color: brandColors.primary }}
                          />
                          Any contribution amount is welcomed and appreciated!
                        </p>
                      </div>
                    </div>
                  </div>
                )}
            </div>
          </div>
        </section>
      )}

      {/* Testimonials Section - Only show if showFeedback is true and there are feedbacks */}
      {eventInfo?.data?.showFeedback &&
        (feedbackData?.feedbacks?.length > 0 || !isFeedbackLoading) && (
          <section id="testimonials" className="py-16 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-4xl lg:text-5xl font-bold">
                  What Attendees Say
                </h2>
                <div className="hidden md:flex items-center gap-3">
                  <button
                    className="flex items-center space-x-2 px-6 py-3 border rounded-md transition-colors"
                    style={{
                      borderColor: brandColors.primary,
                      color: brandColors.primary,
                    }}
                    onMouseEnter={(e) => {
                      (e.target as HTMLButtonElement).style.backgroundColor =
                        brandColors.primary;
                      (e.target as HTMLButtonElement).style.color = "white";
                    }}
                    onMouseLeave={(e) => {
                      (e.target as HTMLButtonElement).style.backgroundColor =
                        "transparent";
                      (e.target as HTMLButtonElement).style.color =
                        brandColors.primary;
                    }}
                    onClick={() => setShowFeedbackModal(true)}
                  >
                    <span>Leave Feedback</span>
                    <Star size={16} />
                  </button>
                  {feedbackData?.feedbacks?.length > 3 && (
                    <button
                      className="flex items-center space-x-2 px-6 py-3 border rounded-md transition-colors"
                      style={{
                        borderColor: brandColors.primary,
                        color: brandColors.primary,
                      }}
                      onMouseEnter={(e) => {
                        (e.target as HTMLButtonElement).style.backgroundColor =
                          brandColors.primary;
                        (e.target as HTMLButtonElement).style.color = "white";
                      }}
                      onMouseLeave={(e) => {
                        (e.target as HTMLButtonElement).style.backgroundColor =
                          "transparent";
                        (e.target as HTMLButtonElement).style.color =
                          brandColors.primary;
                      }}
                      onClick={() =>
                        window.open(
                          `/public-event/${eventId}/feedbacks`,
                          "_blank"
                        )
                      }
                    >
                      <span>See All</span>
                      <ArrowUpRight size={16} />
                    </button>
                  )}
                </div>
              </div>
              <p
                className={`text-center ${themeClasses.accent} mb-8 max-w-2xl mx-auto`}
              >
                Hear from previous participants about their experience at{" "}
                {eventInfo?.data?.name}
              </p>
              <div className="grid md:grid-cols-3 gap-8">
                {(feedbackData?.feedbacks || testimonials)
                  .slice(0, 3)
                  .map((item, idx) => {
                    // Check if it's real feedback data or hardcoded testimonial
                    const isFeedback = item._id !== undefined;

                    return (
                      <div
                        key={item._id || idx}
                        className={`${themeClasses.card} border ${themeClasses.cardBorder} rounded-lg overflow-hidden ${themeClasses.cardHover} transition-colors`}
                      >
                        {/* Media Section */}
                        {((isFeedback && item.media && item.media.length > 0) ||
                          (!isFeedback && item.media)) && (
                          <div className="relative h-48 bg-gray-100">
                            {isFeedback ? (
                              // Real feedback media - handle multiple media with slider
                              <>
                                <div className="relative h-full w-full overflow-hidden">
                                  <div
                                    className="flex h-full transition-transform duration-300"
                                    style={{
                                      transform: `translateX(-${
                                        (item.currentMediaIndex || 0) * 100
                                      }%)`,
                                    }}
                                  >
                                    {item.media.map((mediaUrl, mediaIdx) => (
                                      <div
                                        key={mediaIdx}
                                        className="w-full h-full flex-shrink-0 cursor-pointer"
                                        onClick={() => {
                                          // Open media modal
                                          setSelectedMedia({
                                            urls: item.media,
                                            currentIndex: mediaIdx,
                                          });
                                          setShowMediaModal(true);
                                        }}
                                      >
                                        <img
                                          src={mediaUrl}
                                          alt={`Feedback media ${mediaIdx + 1}`}
                                          className="w-full h-full object-cover hover:scale-105 transition-transform"
                                        />
                                      </div>
                                    ))}
                                  </div>
                                </div>
                                {/* Media indicators */}
                                {item.media.length > 1 && (
                                  <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex gap-1">
                                    {item.media.map((_, dotIdx) => (
                                      <button
                                        key={dotIdx}
                                        className={`w-2 h-2 rounded-full transition-all ${
                                          (item.currentMediaIndex || 0) ===
                                          dotIdx
                                            ? "bg-white w-4"
                                            : "bg-white/50"
                                        }`}
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          // Update current media index for this item
                                          item.currentMediaIndex = dotIdx;
                                        }}
                                      />
                                    ))}
                                  </div>
                                )}
                              </>
                            ) : // Hardcoded testimonial media
                            item.media.type === "image" ? (
                              <img
                                src={item.media.url}
                                alt="Testimonial media"
                                className="w-full h-full object-cover cursor-pointer"
                                onClick={() => {
                                  setSelectedMedia({
                                    urls: [item.media.url],
                                    currentIndex: 0,
                                  });
                                  setShowMediaModal(true);
                                }}
                              />
                            ) : (
                              <div className="relative w-full h-full group cursor-pointer">
                                <img
                                  src={item.media.thumbnail}
                                  alt="Video thumbnail"
                                  className="w-full h-full object-cover"
                                />
                                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                                  <div className="bg-orange-500 rounded-full p-3 group-hover:scale-110 transition-transform">
                                    <Play
                                      className="text-white ml-1"
                                      size={20}
                                      fill="currentColor"
                                    />
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        )}

                        <div className="p-6">
                          <div className="flex items-center mb-4">
                            {[
                              ...Array(
                                isFeedback ? item.rating || 5 : item.rating
                              ),
                            ].map((_, starIdx) => (
                              <Star
                                key={starIdx}
                                className="text-orange-500 fill-current"
                                size={16}
                              />
                            ))}
                          </div>
                          <p className={`${themeClasses.text} mb-6 italic`}>
                            "{isFeedback ? item.comment : item.content}"
                          </p>
                          <div className="flex items-center">
                            {!isFeedback && item.image ? (
                              <img
                                src={item.image}
                                alt={item.name}
                                className="w-12 h-12 rounded-full object-cover mr-4"
                              />
                            ) : (
                              <div className="w-12 h-12 rounded-full bg-slate-200 flex items-center justify-center mr-4">
                                <User className="text-slate-500" size={20} />
                              </div>
                            )}
                            <div>
                              <h4 className="font-semibold">
                                {isFeedback ? item.invitee?.name : item.name}
                              </h4>
                              <p className={`${themeClasses.accent} text-sm`}>
                                {isFeedback
                                  ? item.designation || item.company
                                    ? `${item.designation}${
                                        item.designation && item.company
                                          ? ", "
                                          : ""
                                      }${item.company}`
                                    : "Event Guest"
                                  : item.role}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
              </div>

              {/* Mobile Buttons */}
              <div className="flex flex-col gap-3 mt-8 md:hidden">
                <button
                  className="inline-flex items-center justify-center space-x-2 px-6 py-3 border rounded-md transition-colors"
                  style={{
                    borderColor: brandColors.primary,
                    color: brandColors.primary,
                  }}
                  onClick={() => setShowFeedbackModal(true)}
                >
                  <span>Leave Feedback</span>
                  <Star size={16} />
                </button>
                {feedbackData?.feedbacks?.length > 3 && (
                  <button
                    className="inline-flex items-center justify-center space-x-2 px-6 py-3 border rounded-md transition-colors"
                    style={{
                      borderColor: brandColors.primary,
                      color: brandColors.primary,
                    }}
                    onClick={() =>
                      window.open(
                        `/public-event/${eventId}/feedbacks`,
                        "_blank"
                      )
                    }
                  >
                    <span>See All Feedbacks</span>
                    <ArrowUpRight size={16} />
                  </button>
                )}
              </div>
            </div>
          </section>
        )}

      {/* Sponsors Section - Only show if there are sponsors */}
      {eventInfo?.data?.sponsors && eventInfo.data.sponsors.length > 0 && (
        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-[#0d1129]/50">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-4xl lg:text-5xl font-bold text-center mb-4">
              Sponsors
            </h2>
            <p className="text-center text-slate-400 mb-12 max-w-2xl mx-auto">
              Our valued sponsors who make this event possible
            </p>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
              {eventInfo.data.sponsors.map((sponsor, idx) => (
                <div
                  key={sponsor._id || idx}
                  className="bg-[#0d1129] border border-slate-800 rounded-lg p-6 hover:border-slate-700 transition-colors flex flex-col items-center justify-center group"
                >
                  {sponsor.logo ? (
                    <img
                      src={sponsor.logo}
                      alt={sponsor.name}
                      className="h-12 w-auto mb-2 grayscale group-hover:grayscale-0 transition-all"
                    />
                  ) : (
                    <div className="text-3xl mb-2 grayscale group-hover:grayscale-0 transition-all">
                      {sponsor.name?.charAt(0)}
                    </div>
                  )}
                  <div className="text-lg font-medium text-slate-400 group-hover:text-white transition-colors text-center">
                    {sponsor.name}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Resources Section - Only show if there are public resources */}
      {(() => {
        const publicResources =
          eventInfo?.data?.resources?.filter(
            (resource) => resource.is_public === true
          ) || [];
        return publicResources.length > 0 ? (
          <section className="py-16 px-4 sm:px-6 lg:px-8 bg-[#0d1129]/50">
            <div className="max-w-7xl mx-auto">
              <h2 className="text-4xl lg:text-5xl font-bold text-center mb-4">
                Resources
              </h2>
              <p className="text-center text-slate-400 mb-12 max-w-2xl mx-auto">
                Helpful resources and materials for the event
              </p>
              <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
                {publicResources.map((resource, idx) => (
                  <div
                    key={resource._id || idx}
                    className="bg-[#0d1129] border border-slate-800 rounded-lg p-6 hover:border-slate-700 transition-colors cursor-pointer group"
                    onClick={() =>
                      resource.url && window.open(resource.url, "_blank")
                    }
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h3 className="text-lg font-medium group-hover:text-orange-500 transition-colors mb-2">
                          {resource.name}
                        </h3>
                        {resource.description && (
                          <p className="text-slate-400 text-sm mb-2 line-clamp-2">
                            {resource.description}
                          </p>
                        )}
                        {resource.type && (
                          <span className="inline-block px-2 py-1 text-xs rounded bg-orange-500/20 text-orange-500">
                            {resource.type}
                          </span>
                        )}
                      </div>
                      <ArrowUpRight
                        className="text-orange-500 group-hover:scale-110 transition-transform"
                        size={20}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        ) : null;
      })()}

      {/* Venue Location - Only show if event is not virtual and has venue */}
      {eventInfo?.data?.isVirtual === false && eventInfo?.data?.venue && (
        <section className="py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-4xl lg:text-5xl font-bold text-center mb-4">
              Venue Location
            </h2>
            <div className="text-center mb-8">
              <div className="flex items-center justify-center mb-4">
                <MapPin className="text-orange-500 mr-2" size={24} />
                <span className="text-xl font-medium">
                  {eventInfo.data.venue}
                </span>
              </div>
            </div>
            <div className="bg-[#0d1129] border border-slate-800 rounded-lg overflow-hidden">
              <iframe
                src={`https://www.google.com/maps/embed/v1/place?key=YOUR_API_KEY&q=${encodeURIComponent(
                  eventInfo.data.venue
                )}`}
                width="100%"
                height="400"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="w-full"
              ></iframe>
            </div>
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="bg-[#0d1129] py-8 px-4 sm:px-6 lg:px-8 border-t border-slate-800">
        <div className="max-w-7xl mx-auto text-center text-slate-400">
          <p>
            &copy; {new Date().getFullYear()}{" "}
            {eventInfo?.data?.host || eventInfo?.data?.name}. All rights
            reserved.
          </p>
        </div>
      </footer>

      {/* Video Modal */}
      {showVideoModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-hidden">
            <div className="flex justify-between items-center p-4 border-b">
              <h3 className="text-lg font-semibold text-gray-900">
                Event Video
              </h3>
              <button
                onClick={() => setShowVideoModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={24} />
              </button>
            </div>
            <div className="p-0">
              <video
                className="w-full h-auto"
                controls
                autoPlay
                src={eventInfo?.data?.video}
              >
                Your browser does not support the video tag.
              </video>
            </div>
          </div>
        </div>
      )}

      {/* Media Modal for Feedback Images */}
      {showMediaModal && selectedMedia && (
        <div
          className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4"
          onClick={() => setShowMediaModal(false)}
        >
          <div
            className="relative w-full max-w-4xl h-full max-h-[90vh] flex items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setShowMediaModal(false)}
              className="absolute top-4 right-4 text-white hover:text-red-400 z-10 bg-black/50 rounded-full p-2"
            >
              <X size={24} />
            </button>

            <img
              src={selectedMedia.urls[selectedMedia.currentIndex]}
              alt="Media preview"
              className="max-w-full max-h-full object-contain"
            />

            {/* Navigation arrows */}
            {selectedMedia.urls.length > 1 && (
              <>
                <button
                  onClick={() =>
                    setSelectedMedia((prev) => ({
                      ...prev,
                      currentIndex:
                        (prev.currentIndex - 1 + prev.urls.length) %
                        prev.urls.length,
                    }))
                  }
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-white hover:text-gray-300 bg-black/50 rounded-full p-2"
                >
                  <ChevronLeft size={24} />
                </button>
                <button
                  onClick={() =>
                    setSelectedMedia((prev) => ({
                      ...prev,
                      currentIndex: (prev.currentIndex + 1) % prev.urls.length,
                    }))
                  }
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-white hover:text-gray-300 bg-black/50 rounded-full p-2"
                >
                  <ChevronRight size={24} />
                </button>
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white bg-black/50 px-3 py-1 rounded-full">
                  {selectedMedia.currentIndex + 1} / {selectedMedia.urls.length}
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* Gallery Modal */}
      {showGalleryModal && selectedGalleryItem && (
        <div
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
          onClick={closeGalleryModal}
        >
          {/* Close Button */}
          <button
            onClick={closeGalleryModal}
            className="absolute top-4 right-4 z-60 bg-black/50 hover:bg-black/70 text-white rounded-full p-2 transition-colors"
          >
            <X size={24} />
          </button>

          {/* Previous Button */}
          {eventInfo?.data?.gallery?.length > 1 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                goToPreviousGalleryItem();
              }}
              className="absolute left-4 top-1/2 -translate-y-1/2 z-60 bg-black/50 hover:bg-black/70 text-white rounded-full p-3 transition-colors"
            >
              <ChevronLeft size={24} />
            </button>
          )}

          {/* Next Button */}
          {eventInfo?.data?.gallery?.length > 1 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                goToNextGalleryItem();
              }}
              className="absolute right-4 top-1/2 -translate-y-1/2 z-60 bg-black/50 hover:bg-black/70 text-white rounded-full p-3 transition-colors"
            >
              <ChevronRight size={24} />
            </button>
          )}

          {/* Media Content */}
          <div className="max-w-4xl w-full max-h-[90vh] flex items-center justify-center">
            {isVideo(selectedGalleryItem) ? (
              <video
                src={selectedGalleryItem}
                className="w-full max-h-[80vh] object-contain"
                controls
                autoPlay
                onClick={(e) => e.stopPropagation()}
              />
            ) : (
              <img
                src={selectedGalleryItem}
                alt="Gallery view"
                className="w-full max-h-[80vh] object-contain"
                onClick={(e) => e.stopPropagation()}
              />
            )}
          </div>

          {/* Image Counter */}
          {eventInfo?.data?.gallery?.length > 1 && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/50 text-white px-4 py-2 rounded-full text-sm">
              {galleryCurrentIndex + 1} / {eventInfo.data.gallery.length}
            </div>
          )}
        </div>
      )}

      {/* Registration Forms Modal */}
      {showRegistrationForms && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    Event Registration
                  </h2>
                  <p className="text-gray-600 mt-1">
                    Form {currentFormIndex + 1} of {requiredForms.length}
                  </p>
                </div>
                <button
                  onClick={handleCloseRegistration}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X size={24} />
                </button>
              </div>

              {/* Progress Bar */}
              <div className="mb-6">
                <div className="flex justify-between text-sm text-gray-600 mb-2">
                  <span>Progress</span>
                  <span>
                    {Math.round(
                      ((currentFormIndex + 1) / requiredForms.length) * 100
                    )}
                    %
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-orange-500 h-2 rounded-full transition-all duration-300"
                    style={{
                      width: `${
                        ((currentFormIndex + 1) / requiredForms.length) * 100
                      }%`,
                    }}
                  />
                </div>
              </div>

              {/* Form Content */}
              {isFormLoading ? (
                <div className="flex justify-center items-center py-8">
                  <div className="animate-spin w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full"></div>
                  <span className="ml-2 text-gray-600">Loading form...</span>
                </div>
              ) : currentFormData?.data ? (
                <form onSubmit={handleFormSubmit} className="space-y-6">
                  {/* Form Title */}
                  <div className="text-center">
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      {currentFormData.data.description}
                    </h3>
                    {currentFormData.data.is_required && (
                      <span className="inline-block px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm">
                        Required
                      </span>
                    )}
                  </div>

                  {/* Basic Fields */}
                  {currentFormIndex === 0 && (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Full Name *
                        </label>
                        <input
                          type="text"
                          value={formData.name || ""}
                          onChange={(e) =>
                            handleFormFieldChange("name", e.target.value)
                          }
                          className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                          placeholder="Enter your full name"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Email Address *
                        </label>
                        <input
                          type="email"
                          value={formData.email || ""}
                          onChange={(e) =>
                            handleFormFieldChange("email", e.target.value)
                          }
                          className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                          placeholder="Enter your email address"
                          required
                        />
                      </div>
                    </div>
                  )}

                  {/* Form Fields */}
                  <div className="space-y-4">
                    {currentFormData.data.form_fields?.map((field) => (
                      <div key={field._id}>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          {field.label}
                          {currentFormData.data.is_required &&
                            field.required && (
                              <span className="text-red-500 ml-1">*</span>
                            )}
                        </label>
                        {renderFormField(field)}
                      </div>
                    ))}
                  </div>

                  {/* Navigation Buttons */}
                  <div className="flex justify-between items-center pt-6">
                    <div>
                      {currentFormIndex > 0 && (
                        <button
                          type="button"
                          onClick={handlePreviousForm}
                          className="px-6 py-3 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
                        >
                          Previous
                        </button>
                      )}
                    </div>

                    <div className="flex gap-3">
                      <button
                        type="button"
                        onClick={handleCloseRegistration}
                        className="px-6 py-3 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="px-6 py-3 bg-orange-500 text-white rounded-md hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        {isSubmitting
                          ? "Submitting..."
                          : currentFormIndex === requiredForms.length - 1
                          ? "Complete Registration"
                          : "Next"}
                      </button>
                    </div>
                  </div>
                </form>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-600">
                    Unable to load form. Please try again.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Feedback Modal */}
      {showFeedbackModal && (
        <FeedbackModal
          isOpen={showFeedbackModal}
          onClose={() => setShowFeedbackModal(false)}
          eventId={eventId}
        />
      )}
    </div>
  );
}
