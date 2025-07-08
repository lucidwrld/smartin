"use client";
import GiftRegistryTab from "@/components/events/view/GiftRegistryTab";
import Gallery from "@/components/Gallery";
import TabManager from "@/components/TabManager";
import React, { useState } from "react";
import useGetInviteByCodeManager from "../events/controllers/getInviteByCodeController";
import { getQueryParams } from "@/utils/getQueryParams";
import Loader from "@/components/Loader";
import StatusButton from "@/components/StatusButton";
import { Calendar, Clock, Mail, MapPin, Phone } from "lucide-react";
import { formatDateToLongString } from "@/utils/formatDateToLongString";
import { convertToAmPm } from "@/utils/timeStringToAMPM";
import { logo, logoMain, logoMain1 } from "@/public/images";
import Image from "next/image";
import { EventAccessCard } from "@/components/AccessCard";
import { googleCalendar } from "@/public/icons";
import { capitalizeFirstLetter } from "@/utils/capitalizeFirstLetter";
import CustomButton from "@/components/Button";
import { RespondToInviteManager } from "../events/controllers/respondToInviteController";
import { useRouter } from "next/navigation";
import { addToGoogleCalendar } from "@/utils/addtoGoogleCalendar";
import { openInMaps } from "@/utils/openInMaps";
import Link from "next/link";

const InvitePage = ({}) => {
  const router = useRouter();
  const [currentView, setCurrentView] = useState(0);
  const { code } = getQueryParams(["code"]);
  const { data, isLoading } = useGetInviteByCodeManager({
    code: code,
  });
  const { sendResponse, isLoading: sending } = RespondToInviteManager();
  const [isaccepting, setIsAccepting] = useState();

  const event = data?.event;

  const hasGallery = (event) => {
    return event?.gallery && event.gallery.length > 0;
  };

  const hasGiftRegistry = (event) => {
    const hasDonationDetails =
      event?.donation &&
      (event.donation.account_name ||
        event.donation.bank_name ||
        event.donation.account_number);

    const hasItems = event?.items && event.items.length > 0;

    return hasDonationDetails || hasItems;
  };

  // In your component, modify the tabs section
  // First, create dynamic list of available tabs
  const getAvailableTabs = () => {
    const tabs = [];

    if (hasGallery(event)) {
      tabs.push("Gallery");
    }

    if (hasGiftRegistry(event)) {
      tabs.push("Gift Registry");
    }

    return tabs;
  };

  // Update your JSX
  const availableTabs = getAvailableTabs();
  return isLoading ? (
    <Loader />
  ) : (
    <div className="min-h-screen flex flex-col text-brandBlack">
      {/* Header */}
      <header className="w-full bg-white shadow-sm py-4 px-6">
        <div className="container mx-auto flex justify-between items-center">
          <Image src={logoMain1} alt="Logo" className="h-10 w-auto" />
          <h1 className="text-xl font-medium text-brandBlack">{event?.name}</h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow container mx-auto px-4 max-w-[1111px] py-8">
        <div className="w-full flex flex-col gap-8">
          {/* Event Image and Details */}
          <div className="grid md:grid-cols-2 gap-12">
            <div className="w-full relative rounded-lg overflow-hidden">
              <img
                src={event?.image}
                className="object-cover w-full h-full"
                alt="event-image"
              />
            </div>

            <div className="flex flex-col gap-6">
              {/* Profile Card */}
              <div className="bg-white rounded-lg p-6 shadow-sm">
                <h2 className="text-xl font-medium flex items-center gap-2">
                  {capitalizeFirstLetter(data?.name)}
                  <StatusButton
                    status={data?.response ?? "Awaiting Response"}
                  />
                </h2>
                <div className="mt-4 space-y-3">
                  {data?.email && (
                    <div className="flex items-center gap-2 text-gray-600">
                      <Mail className="w-5 h-5 text-brandPurple" />
                      <span>{data?.email}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2 text-gray-600">
                    <Phone className="w-5 h-5 text-brandPurple" />
                    <span>{data?.phone}</span>
                  </div>
                </div>
              </div>

              {/* Event Details */}
              <div className="space-y-4">
                <p className="font-bold text-lg">{event?.name}</p>
                <p className="text-gray-600">{event?.description}</p>

                <div className="flex flex-col gap-3">
                  <div className="flex items-center gap-2 text-gray-600">
                    <Calendar size={16} className="text-brandPurple" />
                    <span>{formatDateToLongString(event?.date)}</span>
                    <Clock size={16} className="ml-2 text-brandPurple" />
                    <span>{convertToAmPm(event?.time)}</span>
                  </div>
                  <div
                    onClick={() => openInMaps({ address: event?.venue })}
                    className="flex items-center gap-2 text-gray-600"
                  >
                    <MapPin size={16} className="text-brandPurple" />
                    <span className="underline cursor-pointer">
                      {event?.venue}
                    </span>
                  </div>
                </div>
              </div>

              {/* Invite Card */}
              <EventAccessCard inviteDetail={data} />

              {/* Ticketing Notice */}
              {event?.enable_ticketing && data?.response !== "accepted" && (
                <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                      🎫
                    </div>
                    <div>
                      <h4 className="font-medium text-purple-800">Ticket Purchase Required</h4>
                      <p className="text-sm text-purple-700 mt-1">
                        This event requires ticket purchase as part of your invitation acceptance.
                        You'll be able to select and purchase your tickets in the next step.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Calendar Button */}
              {data?.response !== "accepted" ? (
                <div className="flex items-center justify-center gap-5 w-full">
                  <CustomButton
                    buttonText={event?.enable_ticketing ? "Accept & Buy Tickets" : "Accept Invite"}
                    radius={"rounded-full w-full"}
                    buttonColor={"bg-success"}
                    isLoading={sending && isaccepting}
                    onClick={() => {
                      if (event?.enable_ticketing) {
                        // Redirect to ticketed acceptance flow
                        router.push(`/invites/ticketed-accept?code=${code}`);
                      } else if (event?.verification_type === "accessCode") {
                        setIsAccepting(true);
                        //accept invitation
                        const detail = {
                          code: code,
                          response: "accepted",
                        };
                        sendResponse(detail);
                      } else {
                        router.push(`/invites/accept-invite?code=${code}`);
                      }
                    }}
                  />{" "}
                  <CustomButton
                    buttonText={"Decline Invite"}
                    radius={"rounded-full w-full"}
                    buttonColor={"bg-redColor"}
                    isLoading={sending && !isaccepting}
                    onClick={() => {
                      setIsAccepting(false);
                      //accept invitation
                      const detail = {
                        code: code,
                        response: "declined",
                      };
                      sendResponse(detail);
                    }}
                  />
                </div>
              ) : (
                <button
                  onClick={() =>
                    addToGoogleCalendar({
                      date: event?.date,
                      time: event?.time,
                      eventName: event?.name,
                      location: event?.location,
                      durationHours: 2,
                    })
                  }
                  className="font-semibold  w-full max-w-max px-5 flex items-center justify-center gap-2 border rounded-[12px] py-4 hover:bg-gray-50 bg-white"
                >
                  <img src={googleCalendar.src} />
                  Add Event to Calendar
                </button>
              )}
            </div>
          </div>

          {/* Tabs Section */}
          {availableTabs.length > 0 && (
            <>
              {/* Tabs Section */}
              <div className="sticky top-0 py-2 bg-[#F9FAFB] z-50">
                <TabManager
                  currentView={currentView}
                  setCurrentView={setCurrentView}
                  list={availableTabs}
                />
              </div>

              {/* Tab Content */}
              <div className="w-full">
                {currentView === 0 && hasGallery(event) && (
                  <Gallery files={event?.gallery} />
                )}
                {currentView === 1 && hasGiftRegistry(event) && (
                  <GiftRegistryTab
                    isViewOnly={true}
                    event={event}
                    isLoading={isLoading}
                  />
                )}
              </div>
            </>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t py-6">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-600">
            <p>
              Powered by{" "}
              <Link
                href={`https://smartinvites.xyz`}
                className="underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                Smart Invites
              </Link>{" "}
              © {new Date().getFullYear()}
            </p>
            <div className="flex gap-6">
              <a href="/privacy" className="hover:text-brandPurple">
                Privacy Policy
              </a>
              <a href="/terms-and-condition" className="hover:text-brandPurple">
                Terms & Conditions
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default InvitePage;
