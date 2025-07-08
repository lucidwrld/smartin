"use client";
import React, { useState, useEffect, useRef, lazy, Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Calendar,
  Clock,
  Heart,
  MapPin,
  Gift,
  Camera,
  Music,
  Users,
  ChevronDown,
  ArrowRight,
  User,
  Menu,
  X,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Film,
  Share2,
  Copy,
  Check,
  Ticket,
  Search,
  Send,
  MessageSquare,
  FileText,
  Building2,
  Crown,
  Mic,
} from "lucide-react";
import { formatDateToLongString } from "@/utils/formatDateToLongString";
import { convertToAmPm } from "@/utils/timeStringToAMPM";
import { openInMaps } from "@/utils/openInMaps";
import { addToGoogleCalendar } from "@/utils/addtoGoogleCalendar";
import { getQueryParams } from "@/utils/getQueryParams";
import useGetSingleEventPublicManager from "../events/controllers/getSingleEventPublicController";
import Loader from "@/components/Loader";
import { generateMockEventData } from "@/utils/mockEventData";

import FeedbackModal from "@/components/events/publicComponents/FeedbackModal";
import PublicFeedbackDisplay from "@/components/events/publicComponents/PublicFeedbackDisplay";

const EventWebsite = ({ event: rawEvent }) => {
  const router = useRouter();
  const [activeSection, setActiveSection] = useState("home");

  // Generate enhanced event data with mock content for missing sections
  const event = generateMockEventData(rawEvent);

  // const event = eventInfo?.data;

  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [galleryModal, setGalleryModal] = useState({
    open: false,
    currentIndex: 0,
  });
  const [isLoaded, setIsLoaded] = useState(false);
  const [copied, setCopied] = useState(false);
  const [inviteCode, setInviteCode] = useState("");
  const [checkingInvite, setCheckingInvite] = useState(false);
  const [inviteError, setInviteError] = useState("");
  const [showInviteForm, setShowInviteForm] = useState(false);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);

  // Refs for scroll animations
  const sectionRefs = {
    about: useRef(null),
    program: useRef(null),
    speakers: useRef(null),
    resources: useRef(null),
    vendors: useRef(null),
    stakeholders: useRef(null),
    sponsors: useRef(null),
    partners: useRef(null),
    hosts: useRef(null),
    gallery: useRef(null),
    registry: useRef(null),
    invitation: useRef(null),
  };

  // Hardcoded event data for testing
  // const event = {
  //   donation: {
  //     account_name: "Ada Jecinta",
  //     bank_name: "First bank",
  //     account_number: "3078345678",
  //   },
  //   payment_type: "online",
  //   isSuspended: false,
  //   isPaid: true,
  //   isPending: false,
  //   paid_amount: 850,
  //   gallery: [
  //     "https://static01.nyt.com/images/2020/09/04/fashion/00MuslimSeparateWeddings/00MuslimSeparateWeddings-articleLarge.png",
  //     "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?ixlib=rb-4.0.3",
  //     "https://images.unsplash.com/photo-1519225421980-715cb0215aed?ixlib=rb-4.0.3",
  //     "https://images.unsplash.com/photo-1497911270199-1c552ee64aa4?ixlib=rb-4.0.3",
  //     "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?ixlib=rb-4.0.3",
  //     "https://images.unsplash.com/photo-1519225421980-715cb0215aed?ixlib=rb-4.0.3",
  //   ],
  //   isActive: true,
  //   verification_type: "facial",
  //   status: "upcoming",
  //   type: "test",
  //   isVirtual: false,
  //   _id: "67dbeec10dc448bafb3823bf",
  //   name: "Wedding Invitation",
  //   description:
  //     "You are welcomed to be a partaker of our journey. We are pleased to invite you to share in our joy as we exchange vows and begin our new life together. Your presence would make our special day even more memorable.",
  //   host: "Ada & Chuka",
  //   image:
  //     "https://Votemania-b2.s3.us-west-002.backblazeb2.com/counsellme-17356172829535235628.jpg",
  //   event_type: "wedding",
  //   venue: "Usuiji event centre, Jos, Plateau State",
  //   date: "2025-07-22T23:00:00.000Z",
  //   time: "9:00 am",
  //   no_of_invitees: 1,
  //   items: [
  //     {
  //       _id: "67dbeec10dc448bafb3823c0",
  //       name: "Refrigerator",
  //       link: "https://www.jumia.com.ng/haier-thermocool-93-litres-single-door-dcool-refrigerator-hr-135ba-r6-blk-110395490.html?utm_source=twitter&utm_medium=social&utm_campaign=pdpshare",
  //     },
  //     {
  //       _id: "67dbeec10dc448bafb3823c1",
  //       name: "Dinner Set",
  //       link: "https://www.jumia.com.ng/generic-24-pcs-dinner-set-white-gold-with-gift-box-209525123.html",
  //     },
  //     {
  //       _id: "67dbeec10dc448bafb3823c2",
  //       name: "Microwave Oven",
  //       link: "https://www.jumia.com.ng/hisense-20-litres-microwave-oven-mwo-20mommi-black-92842289.html",
  //     },
  //   ],
  //   currency: "NGN",
  //   speakers: [
  //     {
  //       _id: "67dbeec10dc448bafb3823c1",
  //       name: "John Doe",
  //       designation: "Chairman",
  //     },
  //     {
  //       _id: "67dbeec10dc448bafb3823c2",
  //       name: "Jane Smith",
  //       designation: "Master of Ceremony",
  //     },
  //   ],
  //   timezone: "Africa/Lagos",
  //   // Other fields omitted for brevity
  // };

  // Handle invitation verification
  const handleInviteCheck = async (e) => {
    e.preventDefault();
    if (!inviteCode.trim()) {
      setInviteError("Please enter your invitation code");
      return;
    }

    setCheckingInvite(true);
    setInviteError("");

    try {
      // Simulate API check - in a real implementation, you'd use useGetInviteByCodeManager hook
      setTimeout(() => {
        // For demo, let's say TtZQdj is a valid code
        if (inviteCode === "TtZQdj") {
          router.push(`https://smartinvites.xyz/invites/?code=${inviteCode}`);
        } else {
          setInviteError(
            "Invitation not found. Please check your code and try again."
          );
          setCheckingInvite(false);
        }
      }, 1500);

      // In real implementation:
      // const { data, error } = await useGetInviteByCodeManager({ code: inviteCode });
      // if (error) {
      //   setInviteError("Invitation not found. Please check your code and try again.");
      // } else {
      //   router.push(`https://smartinvites.xyz/invites/?code=${inviteCode}`);
      // }
    } catch (error) {
      setInviteError("An error occurred. Please try again later.");
      setCheckingInvite(false);
    }
  };

  // Animation effect when page loads
  useEffect(() => {
    setIsLoaded(true);
  }, []);

  // Intersection Observer for scroll animations
  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: "0px",
      threshold: 0.25,
    };

    const observerCallback = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("animate-section-fade-in");
        }
      });
    };

    const observer = new IntersectionObserver(
      observerCallback,
      observerOptions
    );

    // Observe all section refs
    Object.values(sectionRefs).forEach((ref) => {
      if (ref.current) {
        observer.observe(ref.current);
      }
    });

    return () => {
      Object.values(sectionRefs).forEach((ref) => {
        if (ref.current) {
          observer.unobserve(ref.current);
        }
      });
    };
  }, []);

  // Share event functionality
  const shareEvent = async () => {
    const shareData = {
      title: event.name,
      text: `Join us at ${event.name} on ${formatDateToLongString(
        event.date
      )} at ${event.venue}`,
      url: window.location.href,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        // Fallback for browsers that don't support the Web Share API
        copyEventDetails();
      }
    } catch (err) {
      console.error("Error sharing:", err);
    }
  };

  // Copy event details to clipboard
  const copyEventDetails = () => {
    const details = `
      ${event.name}
      Date: ${formatDateToLongString(event.date)}
      Time: ${convertToAmPm(event.time)}
      Venue: ${event.venue}
      Hosted by: ${event.host}
      
      ${event.description}
      
      Event URL: ${window.location.href}
    `;

    navigator.clipboard.writeText(details.trim());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Determine available sections based on data
  // Add this to the navLinks generation function (around line 180)
  const getAvailableSections = () => {
    const sections = [{ id: "home", label: "Home" }];

    if (event.description) {
      sections.push({ id: "about", label: "About" });
    }

    // Program/Agenda section
    if (event.program?.schedule && event.program.schedule.length > 0) {
      sections.push({ id: "program", label: "Program" });
    }

    if (event.speakers && event.speakers.length > 0) {
      sections.push({ id: "speakers", label: "Speakers" });
    }

    // Resources section
    if (event.resources && event.resources.length > 0) {
      sections.push({ id: "resources", label: "Resources" });
    }

    // Vendors section
    if (event.vendors && event.vendors.length > 0) {
      sections.push({ id: "vendors", label: "Vendors" });
    }

    // Stakeholders section
    if (event.stakeholders && event.stakeholders.length > 0) {
      sections.push({ id: "stakeholders", label: "Team" });
    }

    // Sponsors section
    if (event.sponsors && event.sponsors.length > 0) {
      sections.push({ id: "sponsors", label: "Sponsors" });
    }

    // Partners section
    if (event.partners && event.partners.length > 0) {
      sections.push({ id: "partners", label: "Partners" });
    }

    // Hosts section
    if (event.hosts && event.hosts.length > 0) {
      sections.push({ id: "hosts", label: "Hosts" });
    }

    if (event.gallery && event.gallery.length > 0) {
      sections.push({ id: "gallery", label: "Gallery" });
    }

    if (
      (event.donation &&
        (event.donation.account_name ||
          event.donation.bank_name ||
          event.donation.account_number)) ||
      (event.items && event.items.length > 0)
    ) {
      sections.push({ id: "registry", label: "Registry" });
    }

    // Always add the invitation verification section
    sections.push({ id: "invitation", label: "Check Invitation" });

    return sections;
  };

  const navLinks = getAvailableSections();

  // Countdown timer
  useEffect(() => {
    if (event?.date) {
      const countdownTimer = setInterval(() => {
        const eventDate = new Date(event.date);
        const now = new Date();
        const difference = eventDate.getTime() - now.getTime();

        if (difference <= 0) {
          clearInterval(countdownTimer);
          return;
        }

        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor(
          (difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
        );
        const minutes = Math.floor(
          (difference % (1000 * 60 * 60)) / (1000 * 60)
        );
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);

        setTimeLeft({ days, hours, minutes, seconds });
      }, 1000);

      return () => clearInterval(countdownTimer);
    }
  }, [event?.date]);

  // Scroll to section
  const scrollToSection = (sectionId) => {
    const section = document.getElementById(sectionId);
    if (section) {
      // Use smooth scrolling with offset for fixed header
      const headerHeight = 80; // Approximate header height
      const elementPosition = section.getBoundingClientRect().top;
      const offsetPosition =
        elementPosition + window.pageYOffset - headerHeight;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });

      setActiveSection(sectionId);
      setMobileMenuOpen(false);
    }
  };

  // Lazy load images in gallery
  const handleImageLoad = (index) => {
    // This could be extended to track which images are loaded
    console.log(`Image ${index} loaded`);
  };

  // Preload next and previous images when in gallery modal
  useEffect(() => {
    if (galleryModal.open && event.gallery.length > 1) {
      const nextIndex = (galleryModal.currentIndex + 1) % event.gallery.length;
      const prevIndex =
        (galleryModal.currentIndex - 1 + event.gallery.length) %
        event.gallery.length;

      // Preload next and previous images
      const nextImage = new Image();
      nextImage.src = event.gallery[nextIndex];

      const prevImage = new Image();
      prevImage.src = event.gallery[prevIndex];
    }
  }, [galleryModal.open, galleryModal.currentIndex, event.gallery]);

  // Determine the hero icon based on event type
  const getEventIcon = () => {
    const eventType = event.event_type?.toLowerCase() || "";

    if (
      eventType.includes("wedding") ||
      event.name?.toLowerCase().includes("wedding")
    ) {
      return <Heart className="text-rose-500 h-8 w-8" aria-hidden="true" />;
    } else if (eventType.includes("corporate") || eventType === "business") {
      return <Users className="text-blue-500 h-8 w-8" aria-hidden="true" />;
    } else if (
      eventType.includes("birthday") ||
      event.name?.toLowerCase().includes("birthday")
    ) {
      return <Gift className="text-amber-500 h-8 w-8" aria-hidden="true" />;
    } else {
      return (
        <Calendar className="text-brandPurple h-8 w-8" aria-hidden="true" />
      );
    }
  };

  // Set color theme based on event type
  const getColorTheme = () => {
    const eventType = event.event_type?.toLowerCase() || "";

    if (
      eventType.includes("wedding") ||
      event.name?.toLowerCase().includes("wedding")
    ) {
      return {
        primary: "text-rose-500",
        secondary: "text-rose-300",
        bgLight: "bg-rose-50",
        bgDark: "bg-rose-500",
        bgGradient: "from-rose-50",
        hover: "hover:bg-rose-500",
        border: "border-rose-200",
        shadow: "shadow-rose-100",
        ring: "ring-rose-500",
        fill: "fill-rose-500",
        focusRing: "focus:ring-rose-500",
      };
    } else if (eventType.includes("corporate") || eventType === "business") {
      return {
        primary: "text-blue-500",
        secondary: "text-blue-300",
        bgLight: "bg-blue-50",
        bgDark: "bg-blue-500",
        bgGradient: "from-blue-50",
        hover: "hover:bg-blue-500",
        border: "border-blue-200",
        shadow: "shadow-blue-100",
        ring: "ring-blue-500",
        fill: "fill-blue-500",
        focusRing: "focus:ring-blue-500",
      };
    } else if (
      eventType.includes("birthday") ||
      event.name?.toLowerCase().includes("birthday")
    ) {
      return {
        primary: "text-amber-500",
        secondary: "text-amber-300",
        bgLight: "bg-amber-50",
        bgDark: "bg-amber-500",
        bgGradient: "from-amber-50",
        hover: "hover:bg-amber-500",
        border: "border-amber-200",
        shadow: "shadow-amber-100",
        ring: "ring-amber-500",
        fill: "fill-amber-500",
        focusRing: "focus:ring-amber-500",
      };
    } else {
      return {
        primary: "text-brandPurple",
        secondary: "text-lightPurple",
        bgLight: "bg-backgroundOrange",
        bgDark: "bg-brandPurple",
        bgGradient: "from-backgroundOrange",
        hover: "hover:bg-brandPurple",
        border: "border-lightPurple",
        shadow: "shadow-purple-100", // This is likely a standard Tailwind color
        ring: "ring-brandPurple",
        fill: "fill-brandPurple",
        focusRing: "focus:ring-brandPurple",
      };
    }
  };

  const colors = getColorTheme();

  const navigateGallery = (direction) => {
    if (direction === "next") {
      setGalleryModal({
        ...galleryModal,
        currentIndex: (galleryModal.currentIndex + 1) % event.gallery.length,
      });
    } else {
      setGalleryModal({
        ...galleryModal,
        currentIndex:
          (galleryModal.currentIndex - 1 + event.gallery.length) %
          event.gallery.length,
      });
    }
  };

  // Handle keyboard navigation in gallery
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!galleryModal.open) return;

      if (e.key === "ArrowRight") {
        navigateGallery("next");
      } else if (e.key === "ArrowLeft") {
        navigateGallery("prev");
      } else if (e.key === "Escape") {
        setGalleryModal({ ...galleryModal, open: false });
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [galleryModal]);

  // Touch support for gallery
  const touchStartX = useRef(null);

  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e) => {
    if (touchStartX.current === null) return;

    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartX.current - touchEndX;

    // Check if the touch was a swipe (moved more than 50px)
    if (Math.abs(diff) > 50) {
      if (diff > 0) {
        // Swipe left, go next
        navigateGallery("next");
      } else {
        // Swipe right, go previous
        navigateGallery("prev");
      }
    }

    touchStartX.current = null;
  };

  const renderMediaItem = (url, index) => {
    // Check if the URL is a video (based on common video extensions)
    const isVideo = /\.(mp4|mov|avi|wmv|flv|webm)$/i.test(url);

    if (isVideo) {
      return (
        <div
          key={index}
          className="group relative rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:-translate-y-1"
          onClick={() => setGalleryModal({ open: true, currentIndex: index })}
        >
          <div className="absolute inset-0 bg-black bg-opacity-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
            <Film className="text-white h-12 w-12" aria-hidden="true" />
          </div>
          <video
            className="w-full h-64 object-cover"
            src={url}
            preload="metadata"
            aria-label={`Video ${index + 1}`}
          />
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4">
            <div className="text-white flex items-center text-sm">
              <Film className="h-4 w-4 mr-2" />
              <span>Play video</span>
            </div>
          </div>
        </div>
      );
    } else {
      return (
        <div
          key={index}
          className="group relative rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:-translate-y-1"
          onClick={() => setGalleryModal({ open: true, currentIndex: index })}
        >
          <div className="absolute inset-0 bg-black bg-opacity-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
            <Camera className="text-white h-12 w-12" aria-hidden="true" />
          </div>
          <img
            src={url}
            alt={`Gallery item ${index + 1}`}
            className="w-full h-64 object-cover"
            loading={index < 3 ? "eager" : "lazy"} // Load first 3 eagerly, others lazy
            onLoad={() => handleImageLoad(index)}
          />
        </div>
      );
    }
  };

  // CSS for animations
  const animationCSS = `
    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }
    
    @keyframes fadeSlideUp {
      from { 
        opacity: 0;
        transform: translateY(20px);
      }
      to { 
        opacity: 1;
        transform: translateY(0);
      }
    }
    
    @keyframes scaleIn {
      from { 
        opacity: 0;
        transform: scale(0.9);
      }
      to { 
        opacity: 1;
        transform: scale(1);
      }
    }
    
    @keyframes floatAnimation {
      0% { transform: translateY(0px); }
      50% { transform: translateY(-10px); }
      100% { transform: translateY(0px); }
    }
    
    .animate-fadeIn {
      animation: fadeIn 1s ease forwards;
    }
    
    .animate-fadeSlideUp {
      animation: fadeSlideUp 1s ease forwards;
    }
    
    .animate-scaleIn {
      animation: scaleIn 0.8s ease forwards;
    }
    
    .animate-float {
      animation: floatAnimation 4s ease-in-out infinite;
    }
    
    .animate-section-fade-in {
      opacity: 0;
      transform: translateY(20px);
      animation: fadeSlideUp 1s ease forwards;
    }
    
    @media (prefers-reduced-motion) {
      .animate-fadeIn, .animate-fadeSlideUp, .animate-scaleIn, .animate-float, .animate-section-fade-in {
        animation: none !important;
        opacity: 1 !important;
        transform: none !important;
      }
    }
  `;

  return (
    <div
      className={`font-sans text-gray-800 min-h-screen overflow-x-hidden ${
        isLoaded ? "opacity-100" : "opacity-0"
      } transition-opacity duration-1000`}
    >
      {/* Custom CSS */}
      <style jsx>{animationCSS}</style>
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 bg-white/90 backdrop-blur-md shadow-sm z-50 transition-all duration-300">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              {getEventIcon()}
              <span className="text-xl font-medium ml-2 font-serif">
                {event.name}
              </span>
            </div>

            <div className="hidden md:flex space-x-8">
              {navLinks.map((link) => (
                <button
                  key={link.id}
                  onClick={() => scrollToSection(link.id)}
                  className={`text-sm font-medium hover:${
                    colors.primary
                  } transition-colors ${
                    activeSection === link.id ? colors.primary : "text-gray-600"
                  } relative group`}
                  aria-label={`Go to ${link.label} section`}
                >
                  {link.label}
                  <span
                    className={`absolute -bottom-1 left-0 w-0 h-0.5 ${
                      colors.bgDark
                    } group-hover:w-full transition-all duration-300 ${
                      activeSection === link.id ? "w-full" : ""
                    }`}
                    aria-hidden="true"
                  ></span>
                </button>
              ))}
            </div>

            <div className="md:hidden relative">
              <button
                className="flex items-center text-gray-600"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                aria-expanded={mobileMenuOpen}
                aria-label="Toggle navigation menu"
              >
                {mobileMenuOpen ? (
                  <X className="h-6 w-6" aria-hidden="true" />
                ) : (
                  <Menu className="h-6 w-6" aria-hidden="true" />
                )}
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="md:hidden absolute left-0 right-0 top-full bg-white shadow-md py-4 px-6 z-50 animate-fadeSlideUp">
              <div className="flex flex-col space-y-4">
                {navLinks.map((link) => (
                  <button
                    key={link.id}
                    onClick={() => scrollToSection(link.id)}
                    className={`text-sm font-medium py-2 ${
                      activeSection === link.id
                        ? colors.primary
                        : "text-gray-600"
                    }`}
                    aria-label={`Go to ${link.label} section`}
                  >
                    {link.label}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </nav>
      {/* Hero Section with Blurred Background */}
      <section
        id="home"
        className="relative min-h-screen flex items-center pt-16 overflow-hidden"
        aria-label="Event introduction"
      >
        {/* Blurred background image */}
        <div className="absolute inset-0 z-0">
          <img
            src={event.image}
            alt={`${event.name} background`}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 backdrop-blur-3xl bg-black/30"></div>
        </div>
        {/* <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${event.image})` }}
          aria-hidden="true"
        >
          <div className="absolute inset-0 backdrop-blur-3xl bg-black/30"></div>
        </div> */}

        <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid md:grid-cols-2 gap-16 items-center max-w-6xl mx-auto">
            <div className="order-2 md:order-1 text-center md:text-left">
              <div
                className={`inline-flex items-center justify-center ${colors.bgLight} ${colors.primary} rounded-full px-4 py-1 mb-6 animate-fadeIn shadow-lg`}
              >
                <Calendar className="h-4 w-4 mr-2" aria-hidden="true" />
                <span className="text-sm font-medium">
                  {formatDateToLongString(event.date)}
                </span>
              </div>

              <h1 className="text-4xl md:text-6xl font-serif font-bold text-white mb-6 leading-tight animate-fadeSlideUp drop-shadow-lg">
                {event.name}
              </h1>

              <p
                className="text-xl text-gray-100 mb-8 animate-fadeSlideUp drop-shadow-md"
                style={{ animationDelay: "0.2s" }}
              >
                Hosted by: <span className="font-medium">{event.host}</span>
              </p>

              <div
                className="mb-10 space-y-4 animate-fadeSlideUp"
                style={{ animationDelay: "0.3s" }}
              >
                <div className="text-lg text-white flex items-center justify-center md:justify-start">
                  <Clock
                    className="h-5 w-5 mr-3 text-white/80"
                    aria-hidden="true"
                  />
                  {convertToAmPm(event.time)}
                </div>
                <div className="text-lg text-white flex items-center justify-center md:justify-start">
                  <MapPin
                    className="h-5 w-5 mr-3 text-white/80"
                    aria-hidden="true"
                  />
                  <button
                    className="cursor-pointer hover:underline focus:underline focus:outline-none"
                    onClick={() => openInMaps({ address: event.venue })}
                    aria-label={`View ${event.venue} on map`}
                  >
                    {event.venue}
                  </button>
                </div>
              </div>

              <div
                className="flex flex-wrap gap-4 justify-center md:justify-start animate-fadeSlideUp"
                style={{ animationDelay: "0.4s" }}
              >
                <button
                  onClick={() =>
                    addToGoogleCalendar({
                      date: event.date,
                      time: event.time,
                      eventName: event.name,
                      location: event.venue,
                      durationHours: 2,
                    })
                  }
                  className={`px-6 py-3 bg-white hover:bg-white/90 ${colors.primary} rounded-full transition-all transform hover:scale-105 flex items-center shadow-xl focus:outline-none focus:ring-2 ${colors.focusRing} focus:ring-offset-2`}
                  aria-label="Add this event to your calendar"
                >
                  <Calendar className="mr-2 h-5 w-5" aria-hidden="true" />
                  Add to Calendar
                </button>

                <button
                  onClick={shareEvent}
                  className="px-6 py-3 bg-white/20 backdrop-blur-md text-white rounded-full transition-all hover:bg-white/30 flex items-center focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-1"
                  aria-label="Share event details"
                >
                  <Share2 className="mr-2 h-5 w-5" aria-hidden="true" />
                  {copied ? "Copied!" : "Share Event"}
                </button>
              </div>
            </div>

            <div
              className="order-1 md:order-2 animate-fadeIn"
              style={{ animationDelay: "0.3s" }}
            >
              <div className="relative mx-auto md:mx-0 max-w-md w-full">
                {/* Decorative elements */}
                <div
                  className={`absolute -top-6 -left-6 w-24 h-24 rounded-full bg-white/10 backdrop-blur-md animate-float`}
                  style={{ animationDelay: "0.5s" }}
                ></div>
                <div
                  className={`absolute -bottom-6 -right-6 w-32 h-32 rounded-full bg-white/10 backdrop-blur-md animate-float`}
                  style={{ animationDelay: "1s" }}
                ></div>

                <div
                  className={`absolute inset-0 ${colors.bgLight} rounded-2xl transform rotate-6 ${colors.shadow} -z-10 opacity-70`}
                ></div>
                <div className="relative w-full rounded-2xl overflow-hidden shadow-2xl border-4 border-white/80 backdrop-blur-md">
                  <img
                    src={event.image}
                    alt={event.name}
                    className="w-full h-full object-cover aspect-[3/4]"
                  />
                </div>
                <div
                  className={`absolute -bottom-6 -right-6 ${colors.bgDark} text-white rounded-full px-6 py-4 shadow-lg animate-scaleIn`}
                  style={{ animationDelay: "0.8s" }}
                >
                  <div className="text-2xl font-bold">{timeLeft.days}</div>
                  <div className="text-xs uppercase tracking-wider">
                    Days Left
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Countdown */}
          <div
            className="max-w-4xl mx-auto mt-16 relative z-10 animate-fadeSlideUp"
            style={{ animationDelay: "0.6s" }}
          >
            <div className="grid grid-cols-4 gap-4 max-w-lg mx-auto">
              <div className="bg-white/90 backdrop-blur-md p-4 rounded-lg shadow-xl border border-white/50">
                <div className={`text-3xl font-bold ${colors.primary}`}>
                  {timeLeft.days}
                </div>
                <div className="text-sm text-gray-500">Days</div>
              </div>
              <div className="bg-white/90 backdrop-blur-md p-4 rounded-lg shadow-xl border border-white/50">
                <div className={`text-3xl font-bold ${colors.primary}`}>
                  {timeLeft.hours}
                </div>
                <div className="text-sm text-gray-500">Hours</div>
              </div>
              <div className="bg-white/90 backdrop-blur-md p-4 rounded-lg shadow-xl border border-white/50">
                <div className={`text-3xl font-bold ${colors.primary}`}>
                  {timeLeft.minutes}
                </div>
                <div className="text-sm text-gray-500">Minutes</div>
              </div>
              <div className="bg-white/90 backdrop-blur-md p-4 rounded-lg shadow-xl border border-white/50">
                <div className={`text-3xl font-bold ${colors.primary}`}>
                  {timeLeft.seconds}
                </div>
                <div className="text-sm text-gray-500">Seconds</div>
              </div>
            </div>
          </div>
        </div>

        {/* Decorative elements */}
        <div className="hidden md:block absolute -bottom-8 left-12 transform rotate-12">
          <div
            className={`w-16 h-16 ${colors.bgLight} rounded-full opacity-80`}
          ></div>
        </div>
        <div className="hidden md:block absolute top-20 right-32 transform -rotate-12">
          <div
            className={`w-12 h-12 ${colors.bgLight} rounded-full opacity-60`}
          ></div>
        </div>
      </section>
      {/* About Section */}
      {event.description && (
        <section
          id="about"
          className="py-24 bg-white relative overflow-hidden opacity-0"
          ref={sectionRefs.about}
          aria-label="About the event"
        >
          {/* Decorative background elements */}
          <div className="absolute top-0 left-0 w-64 h-64 bg-gradient-to-r from-gray-100 to-transparent rounded-full -translate-x-1/2 -translate-y-1/2 opacity-80"></div>
          <div className="absolute bottom-0 right-0 w-80 h-80 bg-gradient-to-l from-gray-100 to-transparent rounded-full translate-x-1/2 translate-y-1/2 opacity-80"></div>

          <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="max-w-3xl mx-auto text-center">
              <div
                className={`inline-block ${colors.bgLight} p-2 rounded-full mb-6`}
              >
                {getEventIcon()}
              </div>

              <h2 className="text-3xl md:text-5xl font-serif text-center font-bold text-gray-800 mb-8">
                About Our Event
              </h2>

              <div
                className={`p-8 rounded-2xl shadow-xl ${colors.shadow} relative overflow-hidden`}
              >
                <div
                  className={`absolute -top-12 -left-12 w-24 h-24 ${colors.bgLight} rounded-full opacity-50`}
                ></div>
                <div
                  className={`absolute -bottom-12 -right-12 w-24 h-24 ${colors.bgLight} rounded-full opacity-50`}
                ></div>

                <p className="text-gray-600 leading-relaxed text-lg relative z-10">
                  {event.description}
                </p>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Program Section */}
      {event.program?.schedule && event.program.schedule.length > 0 && (
        <section
          id="program"
          className={`py-24 relative overflow-hidden opacity-0`}
          ref={sectionRefs.program}
          aria-label="Event program"
        >
          <div
            className={`absolute inset-0 bg-gradient-to-b ${colors.bgGradient} to-white opacity-60`}
          ></div>

          <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="text-center mb-16">
              <div
                className={`inline-block ${colors.bgLight} p-3 rounded-full mb-6`}
              >
                <Calendar
                  className={`h-8 w-8 ${colors.primary}`}
                  aria-hidden="true"
                />
              </div>
              <h2 className="text-3xl md:text-5xl font-serif font-bold text-gray-800 mb-4">
                Event Program
              </h2>
              <p className="text-gray-600 max-w-3xl mx-auto text-lg">
                Discover what's planned for this amazing event. Here's the
                detailed schedule and agenda.
              </p>
            </div>

            <div className="max-w-5xl mx-auto space-y-6">
              {event.program.schedule
                .sort((a, b) => {
                  const dateCompare = a.date.localeCompare(b.date);
                  if (dateCompare !== 0) return dateCompare;
                  return a.start_time.localeCompare(b.start_time);
                })
                .filter((session) => session.is_public !== false)
                .map((session, index) => (
                  <div
                    key={index}
                    className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100"
                  >
                    <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-xl font-semibold text-gray-800">
                            {session.title}
                          </h3>
                          {session.session_type && (
                            <span
                              className={`px-3 py-1 text-xs rounded-full ${colors.bgLight} ${colors.primary} font-medium`}
                            >
                              {session.session_type}
                            </span>
                          )}
                        </div>
                        {session.description && (
                          <p className="text-gray-600 mb-3">
                            {session.description}
                          </p>
                        )}
                        {session.speaker && (
                          <p className="text-sm text-gray-700 mb-2">
                            <span className="font-medium">Speaker:</span>{" "}
                            {session.speaker.name}
                            {session.speaker.title && (
                              <span className="text-gray-500">
                                {" "}
                                - {session.speaker.title}
                              </span>
                            )}
                          </p>
                        )}
                      </div>
                      <div className="text-sm text-gray-500 md:text-right md:ml-4">
                        <div className="flex items-center gap-1 mb-1">
                          <Calendar className="w-4 h-4" />
                          {new Date(session.date).toLocaleDateString()}
                        </div>
                        <div className="flex items-center gap-1 mb-1">
                          <Clock className="w-4 h-4" />
                          {session.start_time} - {session.end_time}
                        </div>
                        {session.location && (
                          <div className="flex items-center gap-1">
                            <MapPin className="w-4 h-4" />
                            {session.location}
                          </div>
                        )}
                      </div>
                    </div>
                    {session.tags && session.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {session.tags.map((tag, tagIndex) => (
                          <span
                            key={tagIndex}
                            className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
            </div>
          </div>
        </section>
      )}

      {/* Resources Section */}
      {event.resources && event.resources.length > 0 && (
        <section
          id="resources"
          className="py-24 bg-white relative overflow-hidden opacity-0"
          ref={sectionRefs.resources}
          aria-label="Event resources"
        >
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="text-center mb-16">
              <div
                className={`inline-block ${colors.bgLight} p-3 rounded-full mb-6`}
              >
                <FileText
                  className={`h-8 w-8 ${colors.primary}`}
                  aria-hidden="true"
                />
              </div>
              <h2 className="text-3xl md:text-5xl font-serif font-bold text-gray-800 mb-4">
                Resources
              </h2>
              <p className="text-gray-600 max-w-3xl mx-auto text-lg">
                Access helpful resources, documents, and materials related to
                this event.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
              {event.resources
                .filter(
                  (resource) =>
                    resource.visibility === "public" || !resource.visibility
                )
                .map((resource, index) => (
                  <div
                    key={index}
                    className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 group"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div
                        className={`w-12 h-12 ${colors.bgLight} rounded-lg flex items-center justify-center`}
                      >
                        {resource.type === "document" && (
                          <FileText className={`w-6 h-6 ${colors.primary}`} />
                        )}
                        {resource.type === "image" && (
                          <Camera className={`w-6 h-6 ${colors.primary}`} />
                        )}
                        {resource.type === "video" && (
                          <Film className={`w-6 h-6 ${colors.primary}`} />
                        )}
                        {resource.type === "link" && (
                          <ExternalLink
                            className={`w-6 h-6 ${colors.primary}`}
                          />
                        )}
                      </div>
                      {resource.category && (
                        <span
                          className={`px-2 py-1 text-xs rounded ${colors.bgLight} ${colors.primary}`}
                        >
                          {resource.category}
                        </span>
                      )}
                    </div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-2 group-hover:text-gray-900">
                      {resource.name}
                    </h3>
                    {resource.description && (
                      <p className="text-gray-600 text-sm mb-4">
                        {resource.description}
                      </p>
                    )}
                    <a
                      href={resource.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`inline-flex items-center text-sm ${colors.primary} hover:underline font-medium`}
                    >
                      Access Resource
                      <ExternalLink className="w-4 h-4 ml-1" />
                    </a>
                  </div>
                ))}
            </div>
          </div>
        </section>
      )}

      {/* Vendors Section */}
      {event.vendors && event.vendors.length > 0 && (
        <section
          id="vendors"
          className={`py-24 relative overflow-hidden opacity-0`}
          ref={sectionRefs.vendors}
          aria-label="Event vendors"
        >
          <div
            className={`absolute inset-0 bg-gradient-to-b ${colors.bgGradient} to-white opacity-60`}
          ></div>

          <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="text-center mb-16">
              <div
                className={`inline-block ${colors.bgLight} p-3 rounded-full mb-6`}
              >
                <Building2
                  className={`h-8 w-8 ${colors.primary}`}
                  aria-hidden="true"
                />
              </div>
              <h2 className="text-3xl md:text-5xl font-serif font-bold text-gray-800 mb-4">
                Our Partners
              </h2>
              <p className="text-gray-600 max-w-3xl mx-auto text-lg">
                Meet the amazing vendors and partners who are helping make this
                event possible.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {event.vendors
                .filter(
                  (vendor) =>
                    vendor.status === "confirmed" ||
                    vendor.status === "contracted"
                )
                .map((vendor, index) => (
                  <div
                    key={index}
                    className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 text-center group"
                  >
                    <div
                      className={`w-16 h-16 ${colors.bgLight} rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300`}
                    >
                      <Building2
                        className={`h-8 w-8 ${colors.primary}`}
                        aria-hidden="true"
                      />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">
                      {vendor.company}
                    </h3>
                    <p className={`${colors.primary} text-sm font-medium mb-3`}>
                      {vendor.service_type}
                    </p>
                    {vendor.contact_person && (
                      <p className="text-gray-600 text-sm mb-4">
                        Contact: {vendor.contact_person}
                      </p>
                    )}
                    {vendor.services_provided &&
                      vendor.services_provided.length > 0 && (
                        <div className="flex flex-wrap justify-center gap-1 mb-4">
                          {vendor.services_provided
                            .slice(0, 3)
                            .map((service, serviceIndex) => (
                              <span
                                key={serviceIndex}
                                className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded"
                              >
                                {service}
                              </span>
                            ))}
                        </div>
                      )}
                    {vendor.website && (
                      <a
                        href={vendor.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`inline-flex items-center text-sm ${colors.primary} hover:underline`}
                      >
                        Visit Website
                        <ExternalLink className="w-4 h-4 ml-1" />
                      </a>
                    )}
                  </div>
                ))}
            </div>
          </div>
        </section>
      )}

      {/* Stakeholders/Team Section */}
      {event.stakeholders && event.stakeholders.length > 0 && (
        <section
          id="stakeholders"
          className="py-24 bg-white relative overflow-hidden opacity-0"
          ref={sectionRefs.stakeholders}
          aria-label="Event team"
        >
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="text-center mb-16">
              <div
                className={`inline-block ${colors.bgLight} p-3 rounded-full mb-6`}
              >
                <Users
                  className={`h-8 w-8 ${colors.primary}`}
                  aria-hidden="true"
                />
              </div>
              <h2 className="text-3xl md:text-5xl font-serif font-bold text-gray-800 mb-4">
                Our Team
              </h2>
              <p className="text-gray-600 max-w-3xl mx-auto text-lg">
                Meet the dedicated team members and stakeholders making this
                event happen.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
              {event.stakeholders
                .filter((stakeholder) => stakeholder.status === "active")
                .map((stakeholder, index) => (
                  <div
                    key={index}
                    className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 text-center group"
                  >
                    <div
                      className={`w-16 h-16 ${colors.bgLight} rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300`}
                    >
                      {stakeholder.role === "sponsor" && (
                        <Crown className={`h-8 w-8 ${colors.primary}`} />
                      )}
                      {stakeholder.role === "speaker" && (
                        <Mic className={`h-8 w-8 ${colors.primary}`} />
                      )}
                      {stakeholder.role === "organizer" && (
                        <Users className={`h-8 w-8 ${colors.primary}`} />
                      )}
                      {!["sponsor", "speaker", "organizer"].includes(
                        stakeholder.role
                      ) && <User className={`h-8 w-8 ${colors.primary}`} />}
                    </div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-1">
                      {stakeholder.name}
                    </h3>
                    {stakeholder.title && (
                      <p className="text-gray-600 text-sm mb-2">
                        {stakeholder.title}
                      </p>
                    )}
                    {stakeholder.organization && (
                      <p className="text-gray-500 text-xs mb-3">
                        {stakeholder.organization}
                      </p>
                    )}
                    <span
                      className={`px-3 py-1 text-xs rounded-full ${colors.bgLight} ${colors.primary} font-medium`}
                    >
                      {stakeholder.role}
                    </span>
                    {stakeholder.expertise_areas &&
                      stakeholder.expertise_areas.length > 0 && (
                        <div className="mt-3 flex flex-wrap justify-center gap-1">
                          {stakeholder.expertise_areas
                            .slice(0, 2)
                            .map((area, areaIndex) => (
                              <span
                                key={areaIndex}
                                className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded"
                              >
                                {area}
                              </span>
                            ))}
                        </div>
                      )}
                  </div>
                ))}
            </div>
          </div>
        </section>
      )}

      {/* Sponsors Section */}
      {event.sponsors && event.sponsors.length > 0 && (
        <section
          id="sponsors"
          className={`py-24 relative overflow-hidden opacity-0`}
          ref={sectionRefs.sponsors}
          aria-label="Event sponsors"
        >
          <div
            className={`absolute inset-0 bg-gradient-to-b ${colors.bgGradient} to-white opacity-60`}
          ></div>

          <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="text-center mb-16">
              <div
                className={`inline-block ${colors.bgLight} p-3 rounded-full mb-6`}
              >
                <Crown
                  className={`h-8 w-8 ${colors.primary}`}
                  aria-hidden="true"
                />
              </div>
              <h2 className="text-3xl md:text-5xl font-serif font-bold text-gray-800 mb-4">
                Our Sponsors
              </h2>
              <p className="text-gray-600 max-w-3xl mx-auto text-lg">
                We're grateful to our sponsors who help make this event possible
                through their generous support.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {event.sponsors.map((sponsor, index) => (
                <div
                  key={index}
                  className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 text-center group"
                >
                  <div
                    className={`w-20 h-20 ${colors.bgLight} rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300`}
                  >
                    <Crown
                      className={`h-10 w-10 ${colors.primary}`}
                      aria-hidden="true"
                    />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-3">
                    {sponsor.name}
                  </h3>
                  {sponsor.website && sponsor.website !== "#" && (
                    <a
                      href={sponsor.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`inline-flex items-center text-sm ${colors.primary} hover:underline`}
                    >
                      Visit Website
                      <ExternalLink className="w-4 h-4 ml-1" />
                    </a>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Partners Section */}
      {event.partners && event.partners.length > 0 && (
        <section
          id="partners"
          className="py-24 bg-white relative overflow-hidden opacity-0"
          ref={sectionRefs.partners}
          aria-label="Event partners"
        >
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="text-center mb-16">
              <div
                className={`inline-block ${colors.bgLight} p-3 rounded-full mb-6`}
              >
                <Users
                  className={`h-8 w-8 ${colors.primary}`}
                  aria-hidden="true"
                />
              </div>
              <h2 className="text-3xl md:text-5xl font-serif font-bold text-gray-800 mb-4">
                Our Partners
              </h2>
              <p className="text-gray-600 max-w-3xl mx-auto text-lg">
                Working together with amazing partners to create an exceptional
                experience for everyone.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
              {event.partners.map((partner, index) => (
                <div
                  key={index}
                  className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 text-center group border border-gray-100"
                >
                  <div
                    className={`w-16 h-16 ${colors.bgLight} rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300`}
                  >
                    <Building2
                      className={`h-8 w-8 ${colors.primary}`}
                      aria-hidden="true"
                    />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">
                    {partner.name}
                  </h3>
                  {partner.website && partner.website !== "#" && (
                    <a
                      href={partner.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`inline-flex items-center text-sm ${colors.primary} hover:underline`}
                    >
                      Learn More
                      <ExternalLink className="w-4 h-4 ml-1" />
                    </a>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Hosts Section */}
      {event.hosts && event.hosts.length > 0 && (
        <section
          id="hosts"
          className={`py-24 relative overflow-hidden opacity-0`}
          ref={sectionRefs.hosts}
          aria-label="Event hosts"
        >
          <div
            className={`absolute inset-0 bg-gradient-to-b ${colors.bgGradient} to-white opacity-60`}
          ></div>

          <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="text-center mb-16">
              <div
                className={`inline-block ${colors.bgLight} p-3 rounded-full mb-6`}
              >
                <Mic
                  className={`h-8 w-8 ${colors.primary}`}
                  aria-hidden="true"
                />
              </div>
              <h2 className="text-3xl md:text-5xl font-serif font-bold text-gray-800 mb-4">
                Meet Your Hosts
              </h2>
              <p className="text-gray-600 max-w-3xl mx-auto text-lg">
                The passionate individuals behind this event who are dedicated
                to creating a memorable experience.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {event.hosts.map((host, index) => (
                <div
                  key={index}
                  className="bg-white p-8 rounded-2xl shadow-xl text-center group hover:shadow-2xl transition-all duration-300"
                >
                  <div className="mb-6">
                    {host.image ? (
                      <img
                        src={host.image}
                        alt={host.name}
                        className="w-24 h-24 rounded-full mx-auto object-cover border-4 border-white shadow-lg group-hover:scale-110 transition-transform duration-300"
                      />
                    ) : (
                      <div
                        className={`w-24 h-24 ${colors.bgLight} rounded-full flex items-center justify-center mx-auto group-hover:scale-110 transition-transform duration-300 border-4 border-white shadow-lg`}
                      >
                        <User
                          className={`h-12 w-12 ${colors.primary}`}
                          aria-hidden="true"
                        />
                      </div>
                    )}
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">
                    {host.name}
                  </h3>
                  {host.title && (
                    <p className={`${colors.primary} text-sm font-medium mb-3`}>
                      {host.title}
                    </p>
                  )}
                  {host.bio && (
                    <p className="text-gray-600 text-sm leading-relaxed">
                      {host.bio}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Speakers Section */}
      {event.speakers && event.speakers.length > 0 && (
        <section
          id="speakers"
          className={`py-24 relative overflow-hidden opacity-0`}
          ref={sectionRefs.speakers}
          aria-label="Event speakers"
        >
          <div
            className={`absolute inset-0 bg-gradient-to-b ${colors.bgGradient} to-white opacity-60`}
          ></div>

          <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <h2 className="text-3xl md:text-5xl font-serif text-center font-bold text-gray-800 mb-16">
              Meet Our Speakers
            </h2>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10 max-w-5xl mx-auto">
              {event.speakers.map((speaker, index) => (
                <div
                  key={index}
                  className="bg-white p-8 rounded-2xl shadow-xl text-center group hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2"
                >
                  <div
                    className={`w-28 h-28 ${colors.bgLight} rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-500 border-4 border-white ${colors.shadow}`}
                  >
                    <User
                      className={`h-14 w-14 ${colors.primary}`}
                      aria-hidden="true"
                    />
                  </div>
                  <h3 className="text-2xl font-medium text-gray-800 mb-2">
                    {speaker.name}
                  </h3>
                  <div
                    className={`w-12 h-1 ${colors.bgDark} mx-auto mb-4 rounded`}
                  ></div>
                  <p className={`${colors.primary} text-lg mb-3 font-medium`}>
                    {speaker.designation}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Decorative elements */}
          <div className="absolute -bottom-16 -left-16 w-64 h-64 bg-gradient-to-t from-gray-100 to-transparent rounded-full opacity-50"></div>
          <div className="absolute -top-16 -right-16 w-64 h-64 bg-gradient-to-b from-gray-100 to-transparent rounded-full opacity-50"></div>
        </section>
      )}
      {/* Gallery Section */}
      {event.gallery && event.gallery.length > 0 && (
        <section
          id="gallery"
          className="py-24 bg-white relative opacity-0"
          ref={sectionRefs.gallery}
          aria-label="Event gallery"
        >
          {/* Decorative elements */}
          <div
            className={`absolute top-10 right-10 w-32 h-32 ${colors.bgLight} rounded-full opacity-60`}
          ></div>
          <div
            className={`absolute bottom-10 left-10 w-24 h-24 ${colors.bgLight} rounded-full opacity-40`}
          ></div>

          <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
            <div className="flex items-center justify-center mb-16">
              <div className={`h-1 w-12 ${colors.bgDark} rounded mr-4`}></div>
              <h2 className="text-3xl md:text-5xl font-serif font-bold text-gray-800">
                Event Gallery
              </h2>
              <div className={`h-1 w-12 ${colors.bgDark} rounded ml-4`}></div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
              {event.gallery.map((item, index) => renderMediaItem(item, index))}
            </div>

            <div className="text-center mt-12">
              <button
                onClick={() => setGalleryModal({ open: true, currentIndex: 0 })}
                className={`px-8 py-4 ${colors.bgDark} text-white rounded-full shadow-lg hover:shadow-xl transition-all transform hover:scale-105 inline-flex items-center focus:outline-none focus:ring-2 focus:ring-white`}
                aria-label="Open gallery slideshow"
              >
                <Camera className="mr-2 h-5 w-5" aria-hidden="true" />
                View All Photos
              </button>
            </div>
          </div>

          {/* Gallery Modal */}
          {galleryModal.open && (
            <div
              className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4"
              role="dialog"
              aria-modal="true"
              aria-label="Gallery slideshow"
              onTouchStart={handleTouchStart}
              onTouchEnd={handleTouchEnd}
            >
              <div className="relative w-full max-w-5xl">
                <button
                  onClick={() =>
                    setGalleryModal({ ...galleryModal, open: false })
                  }
                  className="absolute -top-12 right-0 text-white hover:text-gray-300 transition-colors focus:outline-none focus:ring-2 focus:ring-white rounded-full"
                  aria-label="Close gallery"
                >
                  <X className="h-8 w-8" aria-hidden="true" />
                </button>

                <div className="relative">
                  {/* Media Container */}
                  <div className="bg-transparent rounded-lg overflow-hidden">
                    {/\.(mp4|mov|avi|wmv|flv|webm)$/i.test(
                      event.gallery[galleryModal.currentIndex]
                    ) ? (
                      <video
                        src={event.gallery[galleryModal.currentIndex]}
                        controls
                        autoPlay
                        className="w-full h-auto max-h-[70vh] object-contain mx-auto"
                        aria-label={`Video ${
                          galleryModal.currentIndex + 1
                        } of ${event.gallery.length}`}
                      />
                    ) : (
                      <img
                        src={event.gallery[galleryModal.currentIndex]}
                        alt={`Gallery item ${
                          galleryModal.currentIndex + 1
                        } of ${event.gallery.length}`}
                        className="w-full h-auto max-h-[70vh] object-contain mx-auto"
                      />
                    )}
                  </div>

                  {/* Navigation Buttons */}
                  <button
                    onClick={() => navigateGallery("prev")}
                    className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/60 text-white rounded-full p-2 transition-colors focus:outline-none focus:ring-2 focus:ring-white"
                    aria-label="Previous image"
                  >
                    <ChevronLeft className="h-8 w-8" aria-hidden="true" />
                  </button>

                  <button
                    onClick={() => navigateGallery("next")}
                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/60 text-white rounded-full p-2 transition-colors focus:outline-none focus:ring-2 focus:ring-white"
                    aria-label="Next image"
                  >
                    <ChevronRight className="h-8 w-8" aria-hidden="true" />
                  </button>
                </div>

                {/* Thumbnails */}
                <div className="mt-4 flex justify-center space-x-2 overflow-x-auto py-2">
                  {event.gallery.map((item, index) => (
                    <button
                      key={index}
                      onClick={() =>
                        setGalleryModal({
                          ...galleryModal,
                          currentIndex: index,
                        })
                      }
                      className={`w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 border-2 transition-all ${
                        index === galleryModal.currentIndex
                          ? `border-${colors.bgDark} scale-110`
                          : "border-transparent opacity-70 hover:opacity-100"
                      }`}
                      aria-label={`Go to item ${index + 1}`}
                      aria-current={
                        index === galleryModal.currentIndex ? "true" : "false"
                      }
                    >
                      {/\.(mp4|mov|avi|wmv|flv|webm)$/i.test(item) ? (
                        <div className="w-full h-full bg-gray-800 flex items-center justify-center">
                          <Film
                            className="h-6 w-6 text-white"
                            aria-hidden="true"
                          />
                        </div>
                      ) : (
                        <img
                          src={item}
                          alt={`Thumbnail ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      )}
                    </button>
                  ))}
                </div>

                {/* Counter */}
                <div className="text-white text-center mt-4">
                  {galleryModal.currentIndex + 1} / {event.gallery.length}
                </div>
              </div>
            </div>
          )}
        </section>
      )}
      {/* Registry Section */}
      {((event.donation &&
        (event.donation.account_name ||
          event.donation.bank_name ||
          event.donation.account_number)) ||
        (event.items && event.items.length > 0)) && (
        <section
          id="registry"
          className={`py-24 relative overflow-hidden opacity-0`}
          ref={sectionRefs.registry}
          aria-label="Gift registry"
        >
          <div
            className={`absolute inset-0 bg-gradient-to-b ${colors.bgGradient} to-white opacity-60`}
          ></div>

          <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="text-center mb-16">
              <div
                className={`inline-block ${colors.bgLight} p-3 rounded-full mb-6`}
              >
                <Gift
                  className={`h-8 w-8 ${colors.primary}`}
                  aria-hidden="true"
                />
              </div>
              <h2 className="text-3xl md:text-5xl font-serif font-bold text-gray-800 mb-4">
                Gift Registry
              </h2>
              <p className="text-gray-600 max-w-3xl mx-auto text-lg">
                Your presence at our event is the greatest gift of all. However,
                if you wish to honor us with a gift, we've created a registry
                for your convenience.
              </p>
            </div>

            <div className="max-w-5xl mx-auto">
              <div className="grid md:grid-cols-2 gap-8">
                {/* Bank Transfer */}
                {event.donation &&
                  (event.donation.account_name ||
                    event.donation.bank_name ||
                    event.donation.account_number) && (
                    <div className="bg-white p-8 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 border border-gray-100 transform hover:-translate-y-1">
                      <h3
                        className={`text-2xl font-medium text-gray-800 mb-6 flex items-center`}
                      >
                        <div
                          className={`w-10 h-10 ${colors.bgLight} rounded-full flex items-center justify-center mr-4`}
                        >
                          <Gift
                            className={`h-5 w-5 ${colors.primary}`}
                            aria-hidden="true"
                          />
                        </div>
                        Cash Gift
                      </h3>
                      <div className="space-y-5">
                        {event.donation.account_name && (
                          <div className="border-b border-gray-100 pb-4">
                            <span className="text-gray-500 block text-sm mb-1">
                              Account Name
                            </span>
                            <span className="font-medium text-lg">
                              {event.donation.account_name}
                            </span>
                          </div>
                        )}
                        {event.donation.bank_name && (
                          <div className="border-b border-gray-100 pb-4">
                            <span className="text-gray-500 block text-sm mb-1">
                              Bank Name
                            </span>
                            <span className="font-medium text-lg">
                              {event.donation.bank_name}
                            </span>
                          </div>
                        )}
                        {event.donation.account_number && (
                          <div>
                            <span className="text-gray-500 block text-sm mb-1">
                              Account Number
                            </span>
                            <span className="font-medium text-lg">
                              {event.donation.account_number}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                {/* Gift Items */}
                {event.items && event.items.length > 0 && (
                  <div className="bg-white p-8 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 border border-gray-100 transform hover:-translate-y-1">
                    <h3
                      className={`text-2xl font-medium text-gray-800 mb-6 flex items-center`}
                    >
                      <div
                        className={`w-10 h-10 ${colors.bgLight} rounded-full flex items-center justify-center mr-4`}
                      >
                        <Gift
                          className={`h-5 w-5 ${colors.primary}`}
                          aria-hidden="true"
                        />
                      </div>
                      Registry Items
                    </h3>
                    <ul className="space-y-4">
                      {event.items.map((item, index) => (
                        <li key={index}>
                          <a
                            href={item.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block p-4 bg-white border border-gray-100 rounded-xl hover:shadow-md transition-all duration-300 group hover:border-transparent"
                            aria-label={`Gift registry item: ${item.name}`}
                          >
                            <div className="flex justify-between items-center">
                              <span className="font-medium text-gray-800 group-hover:text-gray-900">
                                {item.name}
                              </span>
                              <div
                                className={`w-8 h-8 ${colors.bgLight} rounded-full flex items-center justify-center group-hover:${colors.bgDark} transition-colors`}
                              >
                                <ExternalLink
                                  className={`h-4 w-4 ${colors.primary} group-hover:text-white transition-colors`}
                                  aria-hidden="true"
                                />
                              </div>
                            </div>
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Decorative elements */}
          <div
            className={`absolute bottom-10 left-10 w-40 h-40 ${colors.bgLight} rounded-full opacity-30 animate-float`}
            style={{ animationDelay: "1.5s" }}
          ></div>
          <div
            className={`absolute top-20 right-20 w-24 h-24 ${colors.bgLight} rounded-full opacity-40 animate-float`}
            style={{ animationDelay: "0.7s" }}
          ></div>
        </section>
      )}
      {/* Invitation Verification Section */}
      <section
        id="invitation"
        className="py-24 bg-white relative overflow-hidden opacity-0"
        ref={sectionRefs.invitation}
        aria-labelledby="invitation-heading"
      >
        <div className="absolute top-0 left-0 w-full h-64 bg-gradient-to-b from-gray-50 to-transparent"></div>
        <div className="absolute bottom-0 right-0 w-full h-64 bg-gradient-to-t from-gray-50 to-transparent"></div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <div
              className={`inline-block ${colors.bgLight} p-3 rounded-full mb-6`}
            >
              <Ticket
                className={`h-8 w-8 ${colors.primary}`}
                aria-hidden="true"
              />
            </div>

            <h2
              id="invitation-heading"
              className="text-3xl md:text-5xl font-serif text-center font-bold text-gray-800 mb-4"
            >
              Check Your Invitation
            </h2>

            <p className="text-gray-600 mb-8 text-lg">
              Have you received an invitation? Enter your invitation code below
              to view your personalized details and respond.
            </p>

            <div
              className={`max-w-lg mx-auto p-8 rounded-2xl shadow-xl relative overflow-hidden bg-white border ${colors.border}`}
            >
              <form onSubmit={handleInviteCheck} className="space-y-6">
                <div>
                  <label
                    htmlFor="inviteCode"
                    className="block text-gray-700 font-medium mb-2 text-left"
                  >
                    Your Invitation Code
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      id="inviteCode"
                      value={inviteCode}
                      onChange={(e) => setInviteCode(e.target.value)}
                      placeholder="Enter your invitation code (e.g., TtZQdj)"
                      className={`w-full py-3 px-4 rounded-lg border ${
                        inviteError ? "border-red-300" : colors.border
                      } focus:outline-none focus:ring-2 ${
                        colors.focusRing
                      } text-gray-800 placeholder-gray-400`}
                      disabled={checkingInvite}
                      aria-describedby={inviteError ? "inviteError" : undefined}
                    />
                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                      <Search
                        className={`h-5 w-5 ${colors.secondary}`}
                        aria-hidden="true"
                      />
                    </div>
                  </div>
                  {inviteError && (
                    <p
                      id="inviteError"
                      className="mt-2 text-red-500 text-sm text-left"
                    >
                      {inviteError}
                    </p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={checkingInvite}
                  className={`w-full py-3 px-6 ${colors.bgDark} text-white rounded-lg shadow-md hover:shadow-lg transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 ${colors.focusRing} flex items-center justify-center`}
                  aria-busy={checkingInvite}
                >
                  {checkingInvite ? (
                    <>
                      <svg
                        className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Checking...
                    </>
                  ) : (
                    <>
                      <Send className="mr-2 h-5 w-5" aria-hidden="true" />
                      Check Invitation
                    </>
                  )}
                </button>
              </form>

              <div className="mt-6 pt-6 border-t border-gray-100 text-center text-gray-500 text-sm">
                Don't have an invitation code? Contact the event host for
                assistance.
              </div>
            </div>
          </div>
        </div>
      </section>
      <PublicFeedbackDisplay event={event} colors={colors} />
      {/* Feedback Section - Always visible */}
      <section
        id="feedback"
        className="py-24 bg-white relative overflow-hidden"
      >
        <div className="absolute top-0 left-0 w-full h-64 bg-gradient-to-b from-gray-50 to-transparent"></div>
        <div className="absolute bottom-0 right-0 w-full h-64 bg-gradient-to-t from-gray-50 to-transparent"></div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <div
              className={`inline-block ${colors.bgLight} p-3 rounded-full mb-6`}
            >
              <MessageSquare
                className={`h-8 w-8 ${colors.primary}`}
                aria-hidden="true"
              />
            </div>

            <h2 className="text-3xl md:text-5xl font-serif text-center font-bold text-gray-800 mb-4">
              Share Your Experience
            </h2>

            <p className="text-gray-600 mb-8 text-lg">
              We'd love to hear about your experience at {event.name}. Your
              feedback helps us create even better events in the future.
            </p>

            <div
              className={`max-w-lg mx-auto p-8 rounded-2xl shadow-xl relative overflow-hidden bg-white border ${colors.border}`}
            >
              <div className="text-center">
                <p className="text-gray-700 mb-6">
                  Share your thoughts, photos, or videos from the event. Your
                  feedback is valuable to us and helps other guests know what to
                  expect.
                </p>

                <button
                  onClick={() => setShowFeedbackModal(true)}
                  className={`w-full py-3 px-6 ${colors.bgDark} text-white rounded-lg shadow-md hover:shadow-lg transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 ${colors.focusRing} flex items-center justify-center`}
                >
                  <MessageSquare className="mr-2 h-5 w-5" aria-hidden="true" />
                  Share Your Feedback
                </button>

                <p className="mt-4 text-sm text-gray-500">
                  You'll need your invitation code to leave feedback
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* Feedback Modal */}
      <FeedbackModal
        isOpen={showFeedbackModal}
        onClose={() => setShowFeedbackModal(false)}
        eventId={event.id || event._id}
      />

      {/* Footer */}
      <footer className="py-16 bg-gray-900 text-white relative overflow-hidden">
        {/* <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-10"
          style={{ backgroundImage: `url(${event.image})` }}
        ></div> */}
        <div className="absolute inset-0 z-0">
          <img
            src={event.image}
            alt=""
            className="w-full h-full object-cover opacity-10"
            aria-hidden="true"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent"></div>
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent"></div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-10">
            <div className="inline-block bg-white/10 p-3 rounded-full backdrop-blur-sm mb-6">
              {getEventIcon()}
            </div>
            <h2 className="text-3xl md:text-4xl font-serif font-bold mb-4">
              {event.name}
            </h2>
            <p className="text-gray-400 mb-6 text-lg">
              {formatDateToLongString(event.date)} • {convertToAmPm(event.time)}{" "}
              • {event.venue}
            </p>

            {/* <div className="flex flex-wrap justify-center gap-6 max-w-md mx-auto mb-10">
              {navLinks.map((link) => (
                <button
                  key={link.id}
                  onClick={() => scrollToSection(link.id)}
                  className="text-sm text-gray-400 hover:text-white transition-colors focus:outline-none focus:ring-1 focus:ring-white focus:ring-offset-1 focus:ring-offset-gray-900 rounded"
                >
                  {link.label}
                </button>
              ))}
            </div> */}
            <div className="flex flex-wrap justify-center gap-6 max-w-md mx-auto mb-10">
              {[...navLinks, { id: "feedback", label: "Feedback" }].map(
                (link) => (
                  <button
                    key={link.id}
                    onClick={() => {
                      if (link.id === "feedback") {
                        setShowFeedbackModal(true);
                      } else {
                        scrollToSection(link.id);
                      }
                    }}
                    className="text-sm text-gray-400 hover:text-white transition-colors focus:outline-none focus:ring-1 focus:ring-white focus:ring-offset-1 focus:ring-offset-gray-900 rounded"
                  >
                    {link.label}
                  </button>
                )
              )}
            </div>
            <button
              onClick={() =>
                addToGoogleCalendar({
                  date: event.date,
                  time: event.time,
                  eventName: event.name,
                  location: event.venue,
                  durationHours: 2,
                })
              }
              className="px-6 py-3 bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white rounded-full transition-all transform hover:scale-105 inline-flex items-center mb-12 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-900"
            >
              <Calendar className="mr-2 h-5 w-5" aria-hidden="true" />
              Add to Calendar
            </button>
          </div>

          <div className="border-t border-gray-800 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <p className="text-gray-400 text-sm mb-4 md:mb-0">
                &copy; {new Date().getFullYear()} {event.host}. All rights
                reserved.
              </p>

              <div>
                <Link
                  href="https://smartinvites.xyz"
                  className="text-gray-400 hover:text-white transition-colors text-sm flex items-center"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Powered by{" "}
                  <span className="font-semibold ml-1">Smart Invites</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

// Example usage with the specific event data structure
const EventPage = () => {
  const { id } = getQueryParams(["id"]);

  const {
    data: eventInfo,
    isLoading,
    error,
  } = useGetSingleEventPublicManager({
    eventId: id,
  });
  // Show error message if fetch failed
  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center p-8 max-w-md">
          <div className="text-red-500 mb-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-16 w-16 mx-auto"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Unable to load event
          </h2>
          <p className="text-gray-600 mb-4">
            {error.message || "Please check the event ID and try again."}
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-brandPurple text-white rounded-md hover:bg-opacity-90 transition"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  // Show loading state while fetching data
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin h-10 w-10 border-4 border-gray-300 rounded-full border-t-brandPurple mx-auto mb-4"></div>
          <p className="text-gray-600">Loading event details...</p>
        </div>
      </div>
    );
  }
  // Only render the event website when data is available
  if (!eventInfo?.data) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center p-8 max-w-md">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Event not found
          </h2>
          <p className="text-gray-600">
            The event you're looking for might have been removed or is no longer
            available.
          </p>
        </div>
      </div>
    );
  }
  return <EventWebsite event={eventInfo?.data} />;
};

export default EventPage;
