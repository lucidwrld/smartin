"use client";

import React from "react";
import { Calendar, Clock, MapPin } from "lucide-react";
import CustomButton from "@/components/Button";
import { addToGoogleCalendar } from "@/utils/addtoGoogleCalendar";
import { openInMaps } from "@/utils/openInMaps";

const EventSchedule = ({
  date,
  time,
  location,
  eventName = "Event",
  responseStatus,
}) => {
  return (
    <div className="flex flex-col gap-3 mt-4 text-sm">
      <div className="flex flex-wrap items-center gap-2 text-gray-600">
        <div className="flex items-center gap-2">
          <Calendar size={16} className="text-brandPurple" />
          <span>{date}</span>
        </div>
        <div className="flex items-center gap-2">
          <Clock size={16} className="text-brandPurple" />
          <span>{time}</span>
        </div>
      </div>
      <div
        onClick={() => openInMaps({ address: location })}
        className="flex items-center gap-2 text-gray-600"
      >
        <MapPin size={16} className="text-brandPurple" />
        <span className="break-words underline cursor-pointer">{location}</span>
      </div>
      {responseStatus === "accepted" && (
        <CustomButton
          buttonText="Add to Google Calendar"
          radius="rounded-full mt-5"
          onClick={() =>
            addToGoogleCalendar({
              date: date,
              time: time,
              eventName: eventName,
              location: location,
              durationHours: 2,
            })
          }
        />
      )}
    </div>
  );
};

export { EventSchedule };
