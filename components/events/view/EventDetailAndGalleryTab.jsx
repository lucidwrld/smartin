"use client";
import HeaderWithEdit from "@/components/HeaderWithEdit";
import StatusButton from "@/components/StatusButton";
import React from "react";
import { Calendar, Clock, Mail, MapPin, Phone } from "lucide-react";
import Gallery from "@/components/Gallery";
import { convertToAmPm } from "@/utils/timeStringToAMPM";
import { formatDateToLongString } from "@/utils/formatDateToLongString";
import Loader from "@/components/Loader";
import { QRCodeSVG } from "qrcode.react";
import { useRouter } from "next/navigation";

const EventDetailAndGalleryTab = ({ event, isLoading }) => {
  const route = useRouter();
  return isLoading ? (
    <Loader />
  ) : (
    <div>
      <HeaderWithEdit
        title={"Event Details"}
        href={`/events/create-event?id=${event?.id}&section=event details`}
      />

      <div className="w-full flex flex-col md:flex-row items-start gap-10">
        <div className="w-full md:w-1/2 relative max-h-[60vh] h-full">
          <img
            src={event?.image}
            className="object-cover w-full max-h-[60vh] h-full"
            alt="event-image"
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
              <span className="text-sm">{convertToAmPm(event?.time)}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <MapPin size={16} />
              <span className="text-sm">{event?.venue}</span>
            </div>
          </div>
        </div>
      </div>

      <HeaderWithEdit
        title={"Gallery"}
        href={`/events/create-event?id=${event?.id}&section=gallery`}
      />
      <Gallery files={event?.gallery} />
    </div>
  );
};

export default EventDetailAndGalleryTab;
