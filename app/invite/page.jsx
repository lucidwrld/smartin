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
import { QRCodeSVG } from "qrcode.react";
import useGetSingleEventManager from "../events/controllers/getSingleEventController";
import { formatDateToLongString } from "@/utils/formatDateToLongString";
import { convertToAmPm } from "@/utils/timeStringToAMPM";
import { logo, logoMain } from "@/public/images";
import { Footer } from "@/components/Footer";
import Image from "next/image";
import { EventAccessCard } from "@/components/AccessCard";
import { googleCalendar } from "@/public/icons";

const InvitePage = ({}) => {
  const [currentView, setCurrentView] = useState(0);
  const list = ["Gallery", "Gift Registry"];
  const { code } = getQueryParams(["code"]);
  const { data: eventDetails, isLoading } = useGetSingleEventManager({
    eventId: "6769207ee7d2433e9716216c",
  });
  //   const { data: event, isLoading } = useGetInviteByCodeManager({ code: code });
  const event = eventDetails?.data[0];
  return isLoading ? (
    <Loader />
  ) : (
    <div className="min-h-screen flex flex-col text-brandBlack">
      {/* Header */}
      <header className="w-full bg-white shadow-sm py-4 px-6">
        <div className="container mx-auto flex justify-between items-center">
          <Image src={logo} alt="Logo" className="h-10 w-auto" />
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
                  Abike Akintola
                  <StatusButton status={"accepted"} />
                </h2>
                <div className="mt-4 space-y-3">
                  <div className="flex items-center gap-2 text-gray-600">
                    <Mail className="w-5 h-5 text-brandPurple" />
                    <span>AbikeAkintola@gmail.com</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <Phone className="w-5 h-5 text-brandPurple" />
                    <span>+234 802 123 4567</span>
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
                  <div className="flex items-center gap-2 text-gray-600">
                    <MapPin size={16} className="text-brandPurple" />
                    <span>{event?.venue}</span>
                  </div>
                </div>
              </div>

              {/* Invite Card */}
              <EventAccessCard />

              {/* Calendar Button */}
              <button className="font-semibold  w-full max-w-max px-5 flex items-center justify-center gap-2 border rounded-[12px] py-4 hover:bg-gray-50 bg-white">
                <img src={googleCalendar.src} />
                Add Event to Calendar
              </button>
            </div>
          </div>

          {/* Tabs Section */}
          <div className="sticky top-0 py-2 bg-[#F9FAFB] z-50">
            <TabManager
              currentView={currentView}
              setCurrentView={setCurrentView}
              list={list}
            />
          </div>

          {/* Tab Content */}
          <div className="w-full">
            {currentView === 0 && <Gallery files={event?.gallery} />}
            {currentView === 1 && (
              <GiftRegistryTab
                isViewOnly={true}
                event={event}
                isLoading={isLoading}
              />
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t py-6">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-600">
            <p>Powered by Smart Invites © {new Date().getFullYear()}</p>
            <div className="flex gap-6">
              <a href="/privacy" className="hover:text-brandPurple">
                Privacy Policy
              </a>
              <a href="/terms" className="hover:text-brandPurple">
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
