"use client";
import HeaderWithEdit from "@/components/HeaderWithEdit";
import StatusButton from "@/components/StatusButton";
import React, { useState } from "react";
import {
  Calendar,
  Clock,
  Mail,
  MapPin,
  Phone,
  Share2,
  Wallet,
  MessageSquare,
  X,
} from "lucide-react";
import Gallery from "@/components/Gallery";
import { convertToAmPm } from "@/utils/timeStringToAMPM";
import { formatDateToLongString } from "@/utils/formatDateToLongString";
import Loader from "@/components/Loader";
import { QRCodeSVG } from "qrcode.react";
import { usePathname, useRouter } from "next/navigation";
import CustomButton from "@/components/Button";
import { SuspendEventManager } from "@/app/events/controllers/suspendEventController";
import { ActivateDeactivateEvent } from "@/app/events/controllers/activeDeactivateEventController";
import { EditEventManager } from "@/app/events/controllers/editEventController";
import ResponseComponent from "@/components/Response";
import useGetAllEventFeedbacksManager from "@/app/events/controllers/feedbacks/getAllEventFeedbacksController";
import StatusCard from "@/components/StatusCard";

const EventDetailAndGalleryTab = ({ event, isLoading, analytics, analyticsCards }) => {
  const pathname = usePathname();
  const isAdminPath = pathname?.startsWith("/admin");
  const [showFeedbackToggle, setShowFeedbackToggle] = useState(
    event?.showFeedback || false
  );
  const [showFullScreenImage, setShowFullScreenImage] = useState(false);

  const { suspendEvent, isLoading: suspending } = SuspendEventManager({
    eventId: event?.id,
  });

  const { data: feedbacks } = useGetAllEventFeedbacksManager({
    eventId: event?.id,
  });

  const { manageEvent, isLoading: activating } = ActivateDeactivateEvent({
    eventId: event?.id,
  });

  const { updateEvent, isLoading: updatingFeedback } = EditEventManager({
    eventId: event?.id,
  });

  const route = useRouter();

  // Handle feedback toggle
  const handleFeedbackToggle = async () => {
    const newValue = !showFeedbackToggle;
    setShowFeedbackToggle(newValue);

    try {
      await updateEvent({ showFeedback: newValue });
    } catch (error) {
      // Revert on error
      setShowFeedbackToggle(!newValue);
      console.error("Error updating feedback setting:", error);
    }
  };

  return isLoading ? (
    <Loader />
  ) : (
    <div>
      {/* Analytics Cards */}
      {analyticsCards && (
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Event Analytics</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {analyticsCards.map((card, index) => (
              <StatusCard key={index} {...card} />
            ))}
          </div>
        </div>
      )}

      <HeaderWithEdit
        title={"Event Details"}
        href={`/events/create-event?id=${event?.id}&section=event details`}
      />

      <div className="w-full flex flex-col md:flex-row items-start gap-10">
        <div className="w-full md:w-1/2 relative max-h-[60vh] h-full">
          <img
            src={event?.image}
            className="object-cover w-full max-h-[60vh] h-full cursor-pointer hover:opacity-90 transition-opacity"
            alt="event-image"
            onClick={() => setShowFullScreenImage(true)}
          />
        </div>
        <div className="w-full md:w-1/2 flex flex-col items-start gap-7 p-3">
          <div className="flex items-center gap-2">
            <StatusButton status={event?.isActive ? "Active" : "Inactive"} />
            <StatusButton status={event?.event_type} />
          </div>
          <div className="flex w-full gap-5 flex-col items-start">
            <p className="text-brandBlack font-bold text-16px leading-[16px]">
              {event?.name}
            </p>
            <p className="text-gray-600 text-14px leading-[25.2px] max-w-[90%] w-full">
              {event?.description}
            </p>
          </div>
          <div className="flex flex-col gap-8 py-4">
            <div className="flex items-center gap-2 text-gray-600">
              <Calendar size={16} />
              <span className="text-sm">
                {formatDateToLongString(event?.date)}
              </span>
              <Clock size={16} className="ml-2" />
              <span className="text-sm">{convertToAmPm(event?.event_days?.[0]?.time || event?.time)}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <MapPin size={16} />
              <span className="text-sm">{event?.venue}</span>
            </div>
          </div>

          {/* Feedback Settings */}
          {event?.isPaid && (
            <div className="w-full border-t pt-6">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <MessageSquare className="h-5 w-5 text-purple-600" />
                  <div>
                    <h4 className="font-medium text-gray-900">
                      Event Feedback
                    </h4>
                    <p className="text-sm text-gray-600">
                      Allow guests to see feedback section when available
                    </p>
                  </div>
                </div>
                <div className="flex items-center">
                  <button
                    onClick={handleFeedbackToggle}
                    disabled={updatingFeedback}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 ${
                      showFeedbackToggle ? "bg-purple-600" : "bg-gray-200"
                    } ${
                      updatingFeedback ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        showFeedbackToggle ? "translate-x-6" : "translate-x-1"
                      }`}
                    />
                  </button>
                </div>
              </div>
            </div>
          )}

          {!event?.isPaid && (
            <ResponseComponent
              isSuccess={false}
              error={"Payment required to continue event setup"}
            />
          )}
          {!event?.isPaid && (
            <div className="flex gap-3 w-full">
              <CustomButton
                buttonText={
                  event?.isPending ? "Awaiting Payment Confirmation" : "Pay Now"
                }
                suffixIcon={<Wallet />}
                onClick={() => {
                  route.push(
                    `/events/create-event?id=${event.id}&section=Payment`
                  );
                }}
              />
              {/* Share Event Button...using this as a strategy to get more people using the platform */}
              <CustomButton
                buttonText="Share Event"
                suffixIcon={<Share2 size={16} />}
                onClick={() => {
                  // Generate public event link
                  const eventUrl = `${window.location.origin}/public-event/${event?.id}`;

                  // Try to use Web Share API if available
                  if (navigator.share) {
                    navigator
                      .share({
                        title: event?.name,
                        text: `Check out this event: ${event?.name}`,
                        url: eventUrl,
                      })
                      .catch((err) => {
                        // Fallback to clipboard
                        navigator.clipboard.writeText(eventUrl);
                        // You'll need a state to show a copied notification
                      });
                  } else {
                    // Fallback to clipboard
                    navigator.clipboard.writeText(eventUrl);
                    // You'll need a state to show a copied notification
                  }
                }}
                buttonColor="bg-brandBlack" // or another color of your choice
                radius={"rounded-full"}
                // className="flex-1"
              />
            </div>
          )}

          {event?.isPaid && (
            <div className="flex gap-3 w-full">
              <CustomButton
                buttonText={
                  isAdminPath
                    ? event?.isSuspended
                      ? "Unsuspend Event"
                      : "Suspend Event"
                    : event?.isActive
                    ? "Deactivate Event"
                    : "Activate Event"
                }
                onClick={() => {
                  if (isAdminPath) {
                    suspendEvent();
                  } else {
                    //activate or deactivate event
                    manageEvent();
                  }
                }}
                isLoading={suspending || activating}
                className={"flex-1"}
                buttonColor={
                  event?.isSuspended
                    ? "bg-brandPurple" // if suspended
                    : event?.isActive
                    ? "bg-redColor" // if active but not suspended
                    : "bg-brandPurple" // if neither suspended nor active
                }
                radius={"rounded-full w-full"}
              />
              {/* Share Event Button */}
              <CustomButton
                buttonText="Share Event"
                suffixIcon={<Share2 size={16} />}
                onClick={() => {
                  // Generate public event link
                  const eventUrl = `${window.location.origin}/public-event/${event?.id}`;

                  // Try to use Web Share API if available
                  if (navigator.share) {
                    navigator
                      .share({
                        title: event?.name,
                        text: `Check out this event: ${event?.name}`,
                        url: eventUrl,
                      })
                      .catch((err) => {
                        // Fallback to clipboard
                        navigator.clipboard.writeText(eventUrl);
                        // You'll need a state to show a copied notification
                      });
                  } else {
                    // Fallback to clipboard
                    navigator.clipboard.writeText(eventUrl);
                    // You'll need a state to show a copied notification
                  }
                }}
                buttonColor="bg-brandBlack" // or another color of your choice
                radius={"rounded-full"}
                className="flex-1"
              />
            </div>
          )}
        </div>
      </div>

      <div className="mb-4">
        <h3 className="text-lg font-semibold">Gallery</h3>
      </div>
      <Gallery files={event?.gallery} />

      {/* Full Screen Image Modal */}
      {showFullScreenImage && event?.image && (
        <div
          className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4"
          onClick={() => setShowFullScreenImage(false)}
        >
          {/* Close Button */}
          <button
            onClick={() => setShowFullScreenImage(false)}
            className="absolute top-4 right-4 z-60 bg-black/50 hover:bg-black/70 text-white rounded-full p-2 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>

          {/* Full Screen Image */}
          <div className="max-w-4xl w-full max-h-[90vh] flex items-center justify-center">
            <img
              src={event?.image}
              alt="Event image - full screen"
              className="w-full max-h-[80vh] object-contain"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default EventDetailAndGalleryTab;
