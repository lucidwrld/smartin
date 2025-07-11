"use client";
import React from "react";
import { useParams } from "next/navigation";
import PublicFeedbackDisplay from "@/components/events/publicComponents/PublicFeedbackDisplay";
import useGetSingleEventPublicManager from "@/app/events/controllers/getSingleEventPublicController";
import { ArrowLeft, Home } from "lucide-react";
import Link from "next/link";

export default function AllFeedbacksPage() {
  const resolvedParams = useParams();
  const eventId = resolvedParams?.eventId;

  const { data: eventInfo, isLoading: isEventInfoLoading } = useGetSingleEventPublicManager({
    eventId: eventId,
    enabled: Boolean(eventId),
  });

  // Helper function to darken a color for hover states
  const darkenColor = (color: string, percent: number = 20) => {
    const hex = color.replace('#', '');
    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);
    
    const newR = Math.max(0, Math.floor(r * (1 - percent / 100)));
    const newG = Math.max(0, Math.floor(g * (1 - percent / 100)));
    const newB = Math.max(0, Math.floor(b * (1 - percent / 100)));
    
    return `#${newR.toString(16).padStart(2, '0')}${newG.toString(16).padStart(2, '0')}${newB.toString(16).padStart(2, '0')}`;
  };

  const colors = {
    primary: eventInfo?.data?.colors?.[0] || "#F97316",
    secondary: eventInfo?.data?.colors?.[1] || "#1E293B",
    primaryText: "text-white",
    bgLight: `bg-[${eventInfo?.data?.colors?.[0] || "#F97316"}]/10`,
    bgDark: eventInfo?.data?.colors?.[0] || "#F97316",
  };

  if (isEventInfoLoading) {
    return (
      <div className="min-h-screen bg-[#0a0e27] flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  if (!eventInfo?.data?.showFeedback) {
    return (
      <div className="min-h-screen bg-[#0a0e27] flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Feedbacks not available</h1>
          <Link 
            href={`/public-event/${eventId}`}
            className="text-orange-500 hover:text-orange-400 underline"
          >
            Return to event page
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0e27]">
      {/* Header */}
      <header className="sticky top-0 bg-[#0a0e27]/95 backdrop-blur-sm border-b border-slate-800 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link 
              href={`/public-event/${eventId}`}
              className="flex items-center gap-2 text-white hover:text-orange-500 transition-colors"
            >
              <ArrowLeft size={20} />
              <span>Back to Event</span>
            </Link>
            <h1 className="text-xl font-semibold text-white">
              {eventInfo?.data?.name} - All Feedbacks
            </h1>
            <Link 
              href="/"
              className="text-white hover:text-orange-500 transition-colors"
            >
              <Home size={20} />
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main>
        <PublicFeedbackDisplay
          event={eventInfo?.data}
          colors={colors}
        />
      </main>
    </div>
  );
}