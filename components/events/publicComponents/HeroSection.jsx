"use client";

import React from "react";
import { Calendar, Clock, MapPin, Users, Share2, Heart, Gift } from "lucide-react";
import { formatDateToLongString } from "@/utils/formatDateToLongString";
import { convertToAmPm } from "@/utils/timeStringToAMPM";

const HeroSection = ({ event, onShare, onRSVP, onViewGifts }) => {
  const heroStyle = event?.theme?.heroStyle || "gradient"; // gradient, image, solid

  const getHeroBackground = () => {
    if (heroStyle === "image" && event?.image) {
      return {
        backgroundImage: `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url(${event.image})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      };
    } else if (heroStyle === "gradient") {
      return {
        background: `linear-gradient(135deg, var(--theme-primary), var(--theme-secondary))`,
      };
    } else {
      return {
        backgroundColor: "var(--theme-primary)",
      };
    }
  };

  const formatEventDate = () => {
    if (!event?.date) return "";
    return formatDateToLongString(event.date);
  };

  const formatEventTime = () => {
    if (!event?.time) return "";
    return convertToAmPm(event.time);
  };

  const getEventTypeIcon = () => {
    const type = event?.event_type?.toLowerCase();
    switch (type) {
      case "wedding":
        return "💒";
      case "conference":
        return "🎤";
      case "party":
        return "🎉";
      case "meeting":
        return "🤝";
      case "workshop":
        return "🛠️";
      default:
        return "📅";
    }
  };

  return (
    <div 
      className="relative min-h-screen flex items-center justify-center text-white overflow-hidden"
      style={getHeroBackground()}
    >
      {/* Animated Background Elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-20 w-32 h-32 rounded-full bg-white animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-24 h-24 rounded-full bg-white animate-bounce"></div>
        <div className="absolute top-1/2 left-10 w-16 h-16 rounded-full bg-white animate-ping"></div>
        <div className="absolute top-1/3 right-1/3 w-20 h-20 rounded-full bg-white animate-pulse"></div>
      </div>

      {/* Event Logo/Brand */}
      {event?.logo && (
        <div className="absolute top-8 left-8 z-10">
          <img 
            src={event.logo} 
            alt="Event Logo" 
            className="h-16 w-auto max-w-48 object-contain"
          />
        </div>
      )}

      {/* Main Content */}
      <div className="relative z-10 text-center max-w-4xl mx-auto px-6">
        {/* Event Type Badge */}
        <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 mb-6">
          <span className="text-2xl">{getEventTypeIcon()}</span>
          <span className="text-white/90 font-medium capitalize">
            {event?.event_type || "Event"}
          </span>
        </div>

        {/* Event Title */}
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
          {event?.name || "Special Event"}
        </h1>

        {/* Host Information */}
        {event?.host && (
          <p className="text-xl md:text-2xl text-white/90 mb-8">
            Hosted by <span className="font-semibold">{event.host}</span>
          </p>
        )}

        {/* Event Description */}
        {event?.description && (
          <p className="text-lg md:text-xl text-white/80 mb-10 max-w-2xl mx-auto leading-relaxed">
            {event.description}
          </p>
        )}

        {/* Event Details */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          {/* Date */}
          <div className="flex flex-col items-center p-4 bg-white/10 backdrop-blur-sm rounded-xl">
            <Calendar className="w-8 h-8 mb-2 text-white/90" />
            <span className="text-sm text-white/70 uppercase tracking-wide">Date</span>
            <span className="text-white font-semibold">{formatEventDate()}</span>
          </div>

          {/* Time */}
          <div className="flex flex-col items-center p-4 bg-white/10 backdrop-blur-sm rounded-xl">
            <Clock className="w-8 h-8 mb-2 text-white/90" />
            <span className="text-sm text-white/70 uppercase tracking-wide">Time</span>
            <span className="text-white font-semibold">{formatEventTime()}</span>
          </div>

          {/* Location */}
          <div className="flex flex-col items-center p-4 bg-white/10 backdrop-blur-sm rounded-xl">
            <MapPin className="w-8 h-8 mb-2 text-white/90" />
            <span className="text-sm text-white/70 uppercase tracking-wide">Location</span>
            <span className="text-white font-semibold text-center">
              {event?.isVirtual ? "Virtual Event" : event?.venue || "TBD"}
            </span>
          </div>
        </div>

        {/* Call to Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <button
            onClick={onRSVP}
            className="theme-btn bg-white text-gray-900 hover:bg-gray-100 px-8 py-4 rounded-full font-semibold text-lg transition-all duration-300 transform hover:scale-105 flex items-center gap-2"
          >
            <Users className="w-5 h-5" />
            RSVP Now
          </button>

          {event?.items?.length > 0 && (
            <button
              onClick={onViewGifts}
              className="theme-btn bg-white/20 backdrop-blur-sm border-2 border-white/50 hover:bg-white/30 px-8 py-4 rounded-full font-semibold text-lg transition-all duration-300 flex items-center gap-2"
            >
              <Gift className="w-5 h-5" />
              Gift Registry
            </button>
          )}

          <button
            onClick={onShare}
            className="theme-btn bg-white/20 backdrop-blur-sm border-2 border-white/50 hover:bg-white/30 p-4 rounded-full transition-all duration-300 flex items-center gap-2"
          >
            <Share2 className="w-5 h-5" />
          </button>
        </div>

        {/* Event Stats */}
        {(event?.totalInvites > 0 || event?.attendingCount > 0) && (
          <div className="mt-12 flex justify-center items-center gap-8 text-white/80">
            {event?.totalInvites > 0 && (
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                <span>{event.totalInvites} invited</span>
              </div>
            )}
            {event?.attendingCount > 0 && (
              <div className="flex items-center gap-2">
                <Heart className="w-5 h-5" />
                <span>{event.attendingCount} attending</span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-white/70 rounded-full mt-2 animate-pulse"></div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;