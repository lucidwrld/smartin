"use client";
import React, { useState, useEffect } from "react";
import {
  MapPin,
  Calendar,
  Clock,
  ChevronRight,
  Menu,
  X,
  ArrowUpRight,
  Ticket,
  Users,
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
import { useParams } from "next/navigation";

export default function ConferenceWebsite({
  eventType = "wedding", // "conference", "wedding"
  branding = {
    primaryColor: "#f97316", // orange-500
    secondaryColor: "#ea580c", // orange-600
    logo: null,
    eventName: "Asian Technology Conference 2023",
    organizerName: "M. Faiz Raza Khan",
    organizerTitle: "UI/UX Designer",
  },
}) {
  const resolvedParams = useParams();
  const eventId = resolvedParams?.eventId;

  const { eventInfo, isEventInfoLoading, isEventInfoError } =
    useGetSingleEventPublicManager({
      eventId: eventId,
      enabled: Boolean(eventId),
    });

  if (isEventInfoLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader />
      </div>
    );
  }
  const [timeLeft, setTimeLeft] = useState({
    days: 5,
    hours: 12,
    minutes: 8,
    seconds: 10,
  });
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [accessToken, setAccessToken] = useState("");
  const [checkedIn, setCheckedIn] = useState(false);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  const handleCheckIn = () => {
    if (accessToken.trim()) {
      setCheckedIn(true);
      // Here you would typically validate the token with your backend
    }
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        let { days, hours, minutes, seconds } = prev;

        if (seconds > 0) {
          seconds--;
        } else if (minutes > 0) {
          minutes--;
          seconds = 59;
        } else if (hours > 0) {
          hours--;
          minutes = 59;
          seconds = 59;
        } else if (days > 0) {
          days--;
          hours = 23;
          minutes = 59;
          seconds = 59;
        }

        return { days, hours, minutes, seconds };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const speakers = [
    {
      name: "Hubert Hartle",
      role: "CEO & Founder",
      company: "ABC Enterprises, India",
      description:
        "Necessitatibus eius consequatur ex aliquid fuga eum quidem sint consectetur velit",
      image:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=faces",
    },
    {
      name: "Willow Trantow",
      role: "IT Analyst",
      company: "CloudBit Digital Services, India",
      description:
        "Necessitatibus eius consequatur ex aliquid fuga eum quidem sint consectetur velit",
      image:
        "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=200&h=200&fit=crop&crop=faces",
    },
    {
      name: "Jack Christensen",
      role: "Digital Technology Officer",
      company: "GBZ Enterprises, India",
      description:
        "Necessitatibus eius consequatur ex aliquid fuga eum quidem sint consectetur velit",
      image:
        "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=200&h=200&fit=crop&crop=faces",
    },
    {
      name: "Brenden Legros",
      role: "Owner Thinking",
      company: "ABC Enterprises, India",
      description:
        "Necessitatibus eius consequatur ex aliquid fuga eum quidem sint consectetur velit",
      image:
        "https://images.unsplash.com/photo-1519345182560-3f2917c472ef?w=200&h=200&fit=crop&crop=faces",
    },
  ];

  const sponsors = [
    { name: "afterpay", logo: "🔄" },
    { name: "asana", logo: "📋" },
    { name: "slack", logo: "💬" },
    { name: "dropbox", logo: "📦" },
    { name: "afterpay", logo: "💳" },
    { name: "osana", logo: "🎯" },
  ];

  const tickets = [
    {
      name: "Early Bird",
      price: "$199",
      originalPrice: "$299",
      description: "Perfect for individual attendees",
      features: [
        "Access to all sessions",
        "Networking lunch",
        "Conference materials",
        "Certificate of attendance",
      ],
      popular: false,
    },
    {
      name: "Professional",
      price: "$399",
      originalPrice: "$499",
      description: "Best value for professionals",
      features: [
        "All Early Bird features",
        "VIP seating",
        "Welcome dinner",
        "One-on-one speaker sessions",
        "Premium swag bag",
      ],
      popular: true,
    },
    {
      name: "Enterprise",
      price: "$799",
      originalPrice: "$999",
      description: "Ideal for teams and organizations",
      features: [
        "All Professional features",
        "Priority booking",
        "Private networking events",
        "Company logo placement",
        "Post-event recordings",
      ],
      popular: false,
    },
  ];

  const schedule = [
    {
      time: "8:00 AM",
      title: "Registration & Welcome Coffee",
      speaker: "",
      type: "break",
      description: "Check-in and networking breakfast",
    },
    {
      time: "9:00 AM",
      title: "Opening Keynote: The Future of Technology",
      speaker: "Hubert Hartle",
      type: "keynote",
      description:
        "An inspiring look at emerging technologies and their impact on society",
    },
    {
      time: "10:00 AM",
      title: "AI in Healthcare: Revolutionizing Patient Care",
      speaker: "Dr. Sarah Mitchell",
      type: "session",
      description:
        "Exploring how artificial intelligence is transforming medical diagnosis and treatment",
    },
    {
      time: "11:00 AM",
      title: "Coffee Break & Networking",
      speaker: "",
      type: "break",
      description: "Refreshments and networking opportunities",
    },
    {
      time: "11:30 AM",
      title: "Blockchain Beyond Cryptocurrency",
      speaker: "Mike Chen",
      type: "session",
      description:
        "Real-world applications of blockchain technology in various industries",
    },
    {
      time: "12:30 PM",
      title: "Lunch & Networking Session",
      speaker: "",
      type: "break",
      description: "Gourmet lunch with structured networking activities",
    },
  ];

  const partners = [
    {
      name: "TechCorp Solutions",
      logo: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=200&h=100&fit=crop",
      tier: "Platinum",
      description: "Leading provider of enterprise technology solutions",
    },
    {
      name: "InnovateHub",
      logo: "https://images.unsplash.com/photo-1572021335469-31706a17aaef?w=200&h=100&fit=crop",
      tier: "Gold",
      description: "Supporting innovation and entrepreneurship globally",
    },
    {
      name: "Digital Dynamics",
      logo: "https://images.unsplash.com/photo-1553484771-cc0d9b8c2b33?w=200&h=100&fit=crop",
      tier: "Gold",
      description: "Digital transformation experts and consultants",
    },
    {
      name: "CloudTech Pro",
      logo: "https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=200&h=100&fit=crop",
      tier: "Silver",
      description: "Cloud infrastructure and services provider",
    },
  ];

  const vendors = [
    {
      name: "TechGear Pro",
      booth: "A1",
      category: "Hardware",
      description: "Latest in professional tech equipment and gadgets",
      image:
        "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=300&h=200&fit=crop",
    },
    {
      name: "Software Solutions Inc",
      booth: "B3",
      category: "Software",
      description: "Enterprise software solutions and consulting",
      image:
        "https://images.unsplash.com/photo-1551650975-87deedd944c3?w=300&h=200&fit=crop",
    },
    {
      name: "DataViz Masters",
      booth: "C2",
      category: "Analytics",
      description: "Data visualization and business intelligence tools",
      image:
        "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=300&h=200&fit=crop",
    },
  ];

  const team = [
    {
      name: "Emily Rodriguez",
      role: "Event Director",
      bio: "20+ years in event management and technology conferences",
      image:
        "https://images.unsplash.com/photo-1494790108755-2616b90b3c76?w=200&h=200&fit=crop&crop=faces",
    },
    {
      name: "David Kim",
      role: "Technical Lead",
      bio: "Former CTO with expertise in large-scale event technology",
      image:
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop&crop=faces",
    },
    {
      name: "Lisa Chen",
      role: "Marketing Director",
      bio: "Digital marketing expert specializing in tech events",
      image:
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop&crop=faces",
    },
  ];

  const gallery = [
    "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400&h=300&fit=crop",
    "https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=400&h=300&fit=crop",
    "https://images.unsplash.com/photo-1511578314322-379afb476865?w=400&h=300&fit=crop",
    "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=400&h=300&fit=crop",
    "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop",
    "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=400&h=300&fit=crop",
  ];

  const testimonials = [
    {
      name: "Alex Thompson",
      role: "CTO, StartupXYZ",
      content:
        "This conference completely changed my perspective on emerging technologies. The networking opportunities were invaluable.",
      rating: 5,
      image:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=faces",
      media: {
        type: "image",
        url: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400&h=300&fit=crop",
      },
    },
    {
      name: "Maria Santos",
      role: "Product Manager, TechCorp",
      content:
        "Outstanding speakers, well-organized sessions, and great venue. Already looking forward to next year!",
      rating: 5,
      image:
        "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=100&h=100&fit=crop&crop=faces",
      media: {
        type: "video",
        url: "https://www.youtube.com/embed/dQw4w9WgXcQ",
        thumbnail:
          "https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=400&h=300&fit=crop",
      },
    },
    {
      name: "James Wilson",
      role: "Entrepreneur",
      content:
        "The insights shared here helped me pivot my business strategy. Highly recommend to any tech professional.",
      rating: 5,
      image:
        "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=100&h=100&fit=crop&crop=faces",
      media: {
        type: "image",
        url: "https://images.unsplash.com/photo-1511578314322-379afb476865?w=400&h=300&fit=crop",
      },
    },
  ];

  const registryItems = [
    {
      item: "Premium Welcome Bags",
      description: "Branded welcome bags with conference materials and swag",
      price: "$25",
      purchaseLink: "https://shop.example.com/welcome-bags",
      category: "Conference Materials",
    },
    {
      item: "VIP Networking Dinner",
      description: "Exclusive dinner with speakers and industry leaders",
      price: "$150",
      purchaseLink: "https://shop.example.com/vip-dinner",
      category: "Experiences",
    },
    {
      item: "Tech Workshop Access",
      description: "Hands-on workshops with latest technologies",
      price: "$75",
      purchaseLink: "https://shop.example.com/workshops",
      category: "Learning",
    },
    {
      item: "Conference Recording Bundle",
      description: "Access to all recorded sessions and materials",
      price: "$99",
      purchaseLink: "https://shop.example.com/recordings",
      category: "Digital Content",
    },
    {
      item: "Professional Headshots",
      description: "Professional headshot session during the event",
      price: "$50",
      purchaseLink: "https://shop.example.com/headshots",
      category: "Services",
    },
    {
      item: "Startup Pitch Competition Entry",
      description: "Enter your startup in our pitch competition",
      price: "$200",
      purchaseLink: "https://shop.example.com/pitch-entry",
      category: "Competition",
    },
  ];

  const accountDetails = {
    bankName:
      eventType === "wedding" ? "Wedding Fund Bank" : "Tech Conference Bank",
    accountName:
      eventType === "wedding"
        ? branding.eventName
        : "Asian Technology Conference 2023",
    accountNumber: "1234567890",
    routingNumber: "987654321",
    paypal:
      eventType === "wedding"
        ? "gifts@weddingcelebration.com"
        : "payments@techconference2023.com",
    venmo: eventType === "wedding" ? "@WeddingFund2023" : "@TechConf2023",
  };

  // Wedding-specific data
  const weddingRegistryItems = [
    {
      item: "Honeymoon Fund",
      description: "Help us create magical memories on our honeymoon adventure",
      price: "Any amount",
      purchaseLink: "https://honeymoon.example.com/contribute",
      category: "Experiences",
    },
    {
      item: "Professional Photography",
      description: "Capture our special moments with professional photography",
      price: "$500",
      purchaseLink: "https://shop.example.com/photography",
      category: "Services",
    },
    {
      item: "Wedding Cake Upgrade",
      description: "Premium cake design for our celebration",
      price: "$300",
      purchaseLink: "https://shop.example.com/cake",
      category: "Food & Drinks",
    },
    {
      item: "Flower Arrangements",
      description: "Beautiful floral decorations for the ceremony",
      price: "$200",
      purchaseLink: "https://shop.example.com/flowers",
      category: "Decorations",
    },
    {
      item: "Live Music Band",
      description: "Live entertainment for our celebration",
      price: "$800",
      purchaseLink: "https://shop.example.com/music",
      category: "Entertainment",
    },
    {
      item: "Guest Welcome Gifts",
      description: "Special thank you gifts for our beloved guests",
      price: "$150",
      purchaseLink: "https://shop.example.com/gifts",
      category: "Gifts",
    },
  ];

  const weddingTestimonials = [
    {
      name: "Emma & David",
      role: "Previous Couple",
      content:
        "Our wedding was absolutely magical! Every detail was perfect and our guests had an amazing time.",
      rating: 5,
      image:
        "https://images.unsplash.com/photo-1494790108755-2616b90b3c76?w=100&h=100&fit=crop&crop=faces",
      media: {
        type: "image",
        url: "https://images.unsplash.com/photo-1519741497674-611481863552?w=400&h=300&fit=crop",
      },
    },
    {
      name: "Sarah & Michael",
      role: "2022 Wedding",
      content:
        "The planning was seamless and the celebration exceeded all our expectations. Highly recommend!",
      rating: 5,
      image:
        "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=100&h=100&fit=crop&crop=faces",
      media: {
        type: "video",
        url: "https://www.youtube.com/embed/dQw4w9WgXcQ",
        thumbnail:
          "https://images.unsplash.com/photo-1606800052052-a08af7148866?w=400&h=300&fit=crop",
      },
    },
    {
      name: "Lisa & James",
      role: "2023 Wedding",
      content:
        "From planning to execution, everything was flawless. Our dream wedding became reality!",
      rating: 5,
      image:
        "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=100&h=100&fit=crop&crop=faces",
      media: {
        type: "image",
        url: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=400&h=300&fit=crop",
      },
    },
  ];

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

  const brandColors = {
    primary: branding.primaryColor,
    secondary: branding.secondaryColor,
    primaryHover: branding.secondaryColor,
    primaryText: "text-white",
  };

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
              {branding.logo && (
                <img
                  src={branding.logo}
                  alt="Event Logo"
                  className="h-8 w-auto mr-3"
                />
              )}
              <div>
                <span className="text-xl font-bold">
                  {branding.organizerName}
                </span>
                <span className={`ml-2 text-sm ${themeClasses.accent}`}>
                  {branding.organizerTitle}
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
              <button
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
                {eventType === "wedding" ? "WEDDING CELEBRATION" : "ATC'23"}
              </div>
              <h1 className="text-5xl lg:text-7xl font-bold mb-6 leading-tight">
                {branding.eventName}
              </h1>
              <div className="space-y-3 mb-8">
                <div className={`flex items-center ${themeClasses.accent}`}>
                  <Calendar className="mr-3" size={20} />
                  <span>30 November 2023</span>
                </div>
                <div className={`flex items-center ${themeClasses.accent}`}>
                  <Clock className="mr-3" size={20} />
                  <span>8:00 AM IST</span>
                </div>
                <div className={`flex items-center ${themeClasses.accent}`}>
                  <MapPin className="mr-3" size={20} />
                  <span>Conference Hall, AKC Lane, India</span>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <button
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
                <button
                  className="flex items-center space-x-2 px-6 py-3 border rounded-md transition-colors"
                  style={{
                    borderColor: brandColors.primary,
                    color: brandColors.primary,
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.backgroundColor = brandColors.primary;
                    e.target.style.color = "white";
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.backgroundColor = "transparent";
                    e.target.style.color = brandColors.primary;
                  }}
                >
                  <PlayCircle size={20} />
                  <span>Watch Intro</span>
                </button>
              </div>
            </div>
            <div className="relative">
              <div className="grid grid-cols-2 gap-4">
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
              </div>
              {/* Center play button overlay */}
              <div className="absolute inset-0 flex items-center justify-center">
                <button
                  className="rounded-full p-6 transition-all hover:scale-110 backdrop-blur-sm"
                  style={{
                    backgroundColor: `${brandColors.primary}90`,
                  }}
                  onMouseEnter={(e) =>
                    (e.target.style.backgroundColor = brandColors.primary)
                  }
                  onMouseLeave={(e) =>
                    (e.target.style.backgroundColor = `${brandColors.primary}90`)
                  }
                >
                  <Play
                    className="text-white ml-1"
                    size={32}
                    fill="currentColor"
                  />
                </button>
              </div>
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
          <div className="grid md:grid-cols-3 gap-4 max-w-4xl mx-auto mb-8">
            <div className="bg-[#0d1129] border border-slate-800 rounded-lg p-4 flex items-center">
              <Calendar className="mr-3 text-orange-500" size={24} />
              <div>
                <p className="text-sm text-slate-400">Event Date</p>
                <p className="font-medium">30 November 2023</p>
              </div>
            </div>
            <div className="bg-[#0d1129] border border-slate-800 rounded-lg p-4 flex items-center">
              <Clock className="mr-3 text-orange-500" size={24} />
              <div>
                <p className="text-sm text-slate-400">Event Time</p>
                <p className="font-medium">8:00 AM IST</p>
              </div>
            </div>
            <div className="bg-[#0d1129] border border-slate-800 rounded-lg p-4 flex items-center">
              <MapPin className="mr-3 text-orange-500" size={24} />
              <div>
                <p className="text-sm text-slate-400">Event Location</p>
                <p className="font-medium">Conference Hall, ABC Lane, India</p>
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
                disabled={!accessToken.trim()}
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
                Check In
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
                  Welcome to {branding.eventName}. We're excited to have you
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
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-slate-300 mb-6 leading-relaxed">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
                enim ad minim veniam, quis nostrud exercitation ullamco laboris
                nisi ut aliquip ex ea commodo consequat.
              </p>
              <p className="text-slate-300 leading-relaxed">
                Duis aute irure dolor in reprehenderit in voluptate velit esse
                cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat
                cupidatat non proident.
              </p>
            </div>
            <div className="relative group cursor-pointer">
              <img
                src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&h=400&fit=crop"
                alt="Event Preview"
                className="rounded-lg w-full"
              />
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-lg transition-opacity group-hover:bg-black/60">
                <div className="bg-orange-500 rounded-full p-6 group-hover:scale-110 transition-transform">
                  <ChevronRight size={32} className="ml-1" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Speakers Section */}
      <section id="speakers" className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl lg:text-5xl font-bold text-center mb-4">
            Speakers
          </h2>
          <p className="text-center text-slate-400 mb-12 max-w-2xl mx-auto">
            Necessitatibus eius consequatur ex aliquid fuga eum quidem sint
            consectetur velit
          </p>

          <div className="space-y-8 max-w-6xl mx-auto">
            {speakers.map((speaker, idx) => (
              <div
                key={idx}
                className={`flex items-center gap-6 ${
                  idx % 2 === 0 ? "md:ml-0 md:mr-32" : "md:ml-32 md:mr-0"
                }`}
              >
                <img
                  src={speaker.image}
                  alt={speaker.name}
                  className="w-32 h-32 rounded-lg object-cover grayscale flex-shrink-0"
                />
                <div className="bg-[#0d1129] border border-slate-800 rounded-lg p-6 flex-1 hover:border-slate-700 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold mb-1">
                        {speaker.name}
                      </h3>
                      <p className="text-orange-500 text-sm mb-2">
                        {speaker.role}
                      </p>
                      <p className="text-slate-400 text-sm mb-3">
                        {speaker.company}
                      </p>
                      <p className="text-slate-400 text-sm">
                        {speaker.description}
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

      {/* About Section */}
      <section
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
      </section>

      {/* Tickets Section */}
      <section id="tickets" className="py-16 px-4 sm:px-6 lg:px-8">
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
      </section>

      {/* Programs/Schedule Section */}
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
              {schedule.map((item, idx) => (
                <div
                  key={idx}
                  className={`flex items-start gap-6 p-6 rounded-lg border transition-colors hover:border-slate-700 ${
                    item.type === "keynote"
                      ? "bg-orange-500/10 border-orange-500/30"
                      : item.type === "break"
                      ? "bg-slate-800/50 border-slate-700"
                      : "bg-[#0d1129] border-slate-800"
                  }`}
                >
                  <div className="flex-shrink-0 text-right">
                    <div className="text-orange-500 font-bold text-lg">
                      {item.time}
                    </div>
                    {item.type === "keynote" && (
                      <Award className="text-orange-500 mt-1" size={16} />
                    )}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold mb-1">{item.title}</h3>
                    {item.speaker && (
                      <p className="text-orange-500 text-sm mb-2">
                        Speaker: {item.speaker}
                      </p>
                    )}
                    <p className="text-slate-400 text-sm">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Partners Section */}
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
            {partners.map((partner, idx) => (
              <div
                key={idx}
                className="bg-[#0d1129] border border-slate-800 rounded-lg p-6 hover:border-slate-700 transition-colors group"
              >
                <div className="h-20 mb-4 flex items-center justify-center">
                  <img
                    src={partner.logo}
                    alt={partner.name}
                    className="max-h-full max-w-full object-contain grayscale group-hover:grayscale-0 transition-all"
                  />
                </div>
                <div className="text-center">
                  <span
                    className={`inline-block px-2 py-1 rounded text-xs font-medium mb-2 ${
                      partner.tier === "Platinum"
                        ? "bg-gray-100 text-gray-800"
                        : partner.tier === "Gold"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-gray-600 text-gray-100"
                    }`}
                  >
                    {partner.tier}
                  </span>
                  <h3 className="font-semibold mb-2">{partner.name}</h3>
                  <p className="text-slate-400 text-sm">
                    {partner.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Vendors/Exhibitors Section */}
      <section
        id="vendors"
        className="py-16 px-4 sm:px-6 lg:px-8 bg-[#0d1129]/50"
      >
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl lg:text-5xl font-bold text-center mb-4">
            Exhibitors & Vendors
          </h2>
          <p className="text-center text-slate-400 mb-12 max-w-2xl mx-auto">
            Discover innovative products and services from leading technology
            companies
          </p>
          <div className="grid md:grid-cols-3 gap-8">
            {vendors.map((vendor, idx) => (
              <div
                key={idx}
                className="bg-[#0d1129] border border-slate-800 rounded-lg overflow-hidden hover:border-slate-700 transition-colors group"
              >
                <div className="h-48 overflow-hidden">
                  <img
                    src={vendor.image}
                    alt={vendor.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-xl font-semibold">{vendor.name}</h3>
                    <span className="bg-orange-500/20 text-orange-500 px-2 py-1 rounded text-sm font-medium">
                      Booth {vendor.booth}
                    </span>
                  </div>
                  <p className="text-orange-500 text-sm mb-2">
                    {vendor.category}
                  </p>
                  <p className="text-slate-400 text-sm">{vendor.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section id="team" className="py-16 px-4 sm:px-6 lg:px-8">
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
      </section>

      {/* Gallery Section */}
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
            {gallery.map((image, idx) => (
              <div
                key={idx}
                className="relative group cursor-pointer overflow-hidden rounded-lg"
              >
                <img
                  src={image}
                  alt={`Gallery ${idx + 1}`}
                  className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-colors flex items-center justify-center">
                  <Camera
                    className="text-white opacity-0 group-hover:opacity-100 transition-opacity"
                    size={32}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Special Figures/Keynote Speakers */}
      <section id="keynote" className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl lg:text-5xl font-bold text-center mb-4">
            Keynote Speakers
          </h2>
          <p className="text-center text-slate-400 mb-12 max-w-2xl mx-auto">
            Distinguished industry leaders sharing their insights and vision
          </p>
          <div className="max-w-4xl mx-auto">
            <div className="bg-gradient-to-r from-orange-500/10 to-transparent border border-orange-500/30 rounded-lg p-8">
              <div className="flex items-center gap-8">
                <img
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=faces"
                  alt="Keynote Speaker"
                  className="w-24 h-24 rounded-full object-cover"
                />
                <div className="flex-1">
                  <h3 className="text-2xl font-bold mb-2">Dr. Raj Patel</h3>
                  <p className="text-orange-500 mb-2">
                    Chief Innovation Officer, Global Tech Ventures
                  </p>
                  <p className="text-slate-400">
                    "The Future of AI and Human Collaboration" - An inspiring
                    keynote about the transformative potential of artificial
                    intelligence in creating a better future for humanity.
                  </p>
                </div>
                <Award className="text-orange-500" size={32} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Registry Section */}
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
            <div className="lg:col-span-2">
              <h3 className="text-2xl font-bold mb-6">Registry Items</h3>
              <div className="grid md:grid-cols-2 gap-6">
                {(eventType === "wedding"
                  ? weddingRegistryItems
                  : registryItems
                ).map((item, idx) => (
                  <div
                    key={idx}
                    className={`${themeClasses.card} border ${themeClasses.cardBorder} rounded-lg p-6 ${themeClasses.cardHover} transition-colors`}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h4 className="font-semibold mb-1">{item.item}</h4>
                        <p className={`${themeClasses.accent} text-sm mb-2`}>
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
                        </span>
                      </div>
                      <div className="text-right ml-4">
                        <div
                          className="text-lg font-bold"
                          style={{ color: brandColors.primary }}
                        >
                          {item.price}
                        </div>
                      </div>
                    </div>
                    <a
                      href={item.purchaseLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block w-full py-2 px-4 text-center rounded-md font-medium transition-colors text-white"
                      style={{ backgroundColor: brandColors.primary }}
                      onMouseEnter={(e) =>
                        (e.target.style.backgroundColor = brandColors.secondary)
                      }
                      onMouseLeave={(e) =>
                        (e.target.style.backgroundColor = brandColors.primary)
                      }
                    >
                      Purchase
                    </a>
                  </div>
                ))}
              </div>
            </div>

            {/* Account Details */}
            <div className="lg:col-span-1">
              <h3 className="text-2xl font-bold mb-6">Direct Contribution</h3>
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
                      {accountDetails.bankName}
                    </span>
                  </div>
                  <div>
                    <span
                      className={`block ${themeClasses.accent} text-xs uppercase tracking-wide mb-1`}
                    >
                      Account Name
                    </span>
                    <span className="font-medium">
                      {accountDetails.accountName}
                    </span>
                  </div>
                  <div>
                    <span
                      className={`block ${themeClasses.accent} text-xs uppercase tracking-wide mb-1`}
                    >
                      Account Number
                    </span>
                    <span className="font-medium font-mono">
                      {accountDetails.accountNumber}
                    </span>
                  </div>
                  <div>
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
                  </div>
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
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-4xl lg:text-5xl font-bold">
              What Attendees Say
            </h2>
            <button
              className="hidden md:flex items-center space-x-2 px-6 py-3 border rounded-md transition-colors"
              style={{
                borderColor: brandColors.primary,
                color: brandColors.primary,
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = brandColors.primary;
                e.target.style.color = "white";
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = "transparent";
                e.target.style.color = brandColors.primary;
              }}
              onClick={() => window.open("/testimonials", "_blank")}
            >
              <span>See All</span>
              <ArrowUpRight size={16} />
            </button>
          </div>
          <p
            className={`text-center ${themeClasses.accent} mb-8 max-w-2xl mx-auto`}
          >
            Hear from previous participants about their experience at our{" "}
            {eventType === "wedding" ? "celebration" : "conference"}
          </p>
          <div className="grid md:grid-cols-3 gap-8">
            {(eventType === "wedding" ? weddingTestimonials : testimonials)
              .slice(0, 3)
              .map((testimonial, idx) => (
                <div
                  key={idx}
                  className={`${themeClasses.card} border ${themeClasses.cardBorder} rounded-lg overflow-hidden ${themeClasses.cardHover} transition-colors`}
                >
                  {/* Media Section */}
                  {testimonial.media && (
                    <div className="relative h-48 bg-gray-100">
                      {testimonial.media.type === "image" ? (
                        <img
                          src={testimonial.media.url}
                          alt="Testimonial media"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="relative w-full h-full group cursor-pointer">
                          <img
                            src={testimonial.media.thumbnail}
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
                      {[...Array(testimonial.rating)].map((_, starIdx) => (
                        <Star
                          key={starIdx}
                          className="text-orange-500 fill-current"
                          size={16}
                        />
                      ))}
                    </div>
                    <p className={`${themeClasses.text} mb-6 italic`}>
                      "{testimonial.content}"
                    </p>
                    <div className="flex items-center">
                      <img
                        src={testimonial.image}
                        alt={testimonial.name}
                        className="w-12 h-12 rounded-full object-cover mr-4"
                      />
                      <div>
                        <h4 className="font-semibold">{testimonial.name}</h4>
                        <p className={`${themeClasses.accent} text-sm`}>
                          {testimonial.role}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
          </div>

          {/* Mobile See All Button */}
          <div className="text-center mt-8 md:hidden">
            <button
              className="inline-flex items-center space-x-2 px-6 py-3 border rounded-md transition-colors"
              style={{
                borderColor: brandColors.primary,
                color: brandColors.primary,
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = brandColors.primary;
                e.target.style.color = "white";
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = "transparent";
                e.target.style.color = brandColors.primary;
              }}
              onClick={() => window.open("/testimonials", "_blank")}
            >
              <span>See All Testimonials</span>
              <ArrowUpRight size={16} />
            </button>
          </div>
        </div>
      </section>

      {/* Sponsors Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-[#0d1129]/50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl lg:text-5xl font-bold text-center mb-4">
            Gold Sponsors
          </h2>
          <p className="text-center text-slate-400 mb-12 max-w-2xl mx-auto">
            Necessitatibus eius consequatur ex aliquid fuga eum quidem sint
            consectetur velit
          </p>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {sponsors.map((sponsor, idx) => (
              <div
                key={idx}
                className="bg-[#0d1129] border border-slate-800 rounded-lg p-6 hover:border-slate-700 transition-colors flex flex-col items-center justify-center group"
              >
                <div className="text-3xl mb-2 grayscale group-hover:grayscale-0 transition-all">
                  {sponsor.logo}
                </div>
                <div className="text-lg font-medium text-slate-400 group-hover:text-white transition-colors">
                  {sponsor.name}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Resources Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-[#0d1129]/50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl lg:text-5xl font-bold text-center mb-4">
            Resources
          </h2>
          <p className="text-center text-slate-400 mb-12 max-w-2xl mx-auto">
            Necessitatibus eius consequatur ex aliquid fuga eum quidem sint
            consectetur velit
          </p>
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {["Resource 3", "Resource 2", "Resource 1"].map((resource, idx) => (
              <div
                key={idx}
                className="bg-[#0d1129] border border-slate-800 rounded-lg p-6 hover:border-slate-700 transition-colors cursor-pointer group"
              >
                <div className="flex items-center justify-between">
                  <span className="text-lg font-medium group-hover:text-orange-500 transition-colors">
                    {resource}
                  </span>
                  <div className="text-orange-500 text-3xl font-bold">
                    {3 - idx}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Venue Location */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl lg:text-5xl font-bold text-center mb-12">
            Venue Location
          </h2>
          <div className="bg-[#0d1129] border border-slate-800 rounded-lg overflow-hidden">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3782.2613173278896!2d73.91411937501422!3d18.562253982539413!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bc2c147b8b3a3bf%3A0x6f7fdcc8e4d6c77e!2sPhoenix%20Marketcity%20Pune!5e0!3m2!1sen!2sin!4v1696837073445!5m2!1sen!2sin"
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

      {/* Footer */}
      <footer className="bg-[#0d1129] py-8 px-4 sm:px-6 lg:px-8 border-t border-slate-800">
        <div className="max-w-7xl mx-auto text-center text-slate-400">
          <p>&copy; 2023 Asian Technology Conference. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

// Example usage components for different event types

// // Wedding Event Example
export function WeddingEvent() {
  return (
    <ConferenceWebsite
      eventType="wedding"
      branding={{
        primaryColor: "#d946ef", // Fuchsia
        secondaryColor: "#c026d3", // Fuchsia-600
        logo: null, // Add logo URL here
        eventName: "Sarah & Michael's Wedding",
        organizerName: "Sarah & Michael",
        organizerTitle: "Getting Married!",
      }}
    />
  );
}

// // Tech Conference Example
export function TechConference() {
  return (
    <ConferenceWebsite
      eventType="conference"
      branding={{
        primaryColor: "#0ea5e9", // Sky-500
        secondaryColor: "#0284c7", // Sky-600
        logo: "https://via.placeholder.com/120x40/0ea5e9/ffffff?text=LOGO",
        eventName: "Future Tech Summit 2024",
        organizerName: "TechEvents Inc",
        organizerTitle: "Event Organizers",
      }}
    />
  );
}

// Corporate Event Example
export function CorporateEvent() {
  return (
    <ConferenceWebsite
      eventType="conference"
      branding={{
        primaryColor: "#7c3aed", // Violet-600
        secondaryColor: "#6d28d9", // Violet-700
        logo: "https://via.placeholder.com/120x40/7c3aed/ffffff?text=CORP",
        eventName: "Annual Company Retreat 2024",
        organizerName: "Corporate Events Team",
        organizerTitle: "Human Resources",
      }}
    />
  );
}
