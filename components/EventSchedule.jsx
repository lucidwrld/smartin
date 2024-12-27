"use client";

import React from "react";
import { Calendar, Clock, MapPin } from "lucide-react";
import CustomButton from "@/components/Button";

const EventSchedule = ({ date, time, location, eventName = "Event" }) => {
  const addToCalendar = () => {
    try {
      // Example input: "Tuesday, December 10, 2024" and "10:00 AM"
      const dateStr = date.split(", ")[1] + " " + date.split(", ")[2]; // "December 10, 2024"
      const dateObj = new Date(dateStr);

      // Handle time
      const [hourStr, minuteStr] = time.split(":");
      const minutes = parseInt(minuteStr);
      let hours = parseInt(hourStr);

      if (time.toLowerCase().includes("pm") && hours !== 12) {
        hours += 12;
      } else if (time.toLowerCase().includes("am") && hours === 12) {
        hours = 0;
      }

      // Set the time
      dateObj.setHours(hours, minutes);

      // Create end time (2 hours later)
      const endObj = new Date(dateObj);
      endObj.setHours(dateObj.getHours() + 2);

      // Create Google Calendar URL
      const calendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(
        eventName
      )}&dates=${dateObj.getFullYear()}${String(
        dateObj.getMonth() + 1
      ).padStart(2, "0")}${String(dateObj.getDate()).padStart(2, "0")}T${String(
        dateObj.getHours()
      ).padStart(2, "0")}${String(dateObj.getMinutes()).padStart(
        2,
        "0"
      )}00/${endObj.getFullYear()}${String(endObj.getMonth() + 1).padStart(
        2,
        "0"
      )}${String(endObj.getDate()).padStart(2, "0")}T${String(
        endObj.getHours()
      ).padStart(2, "0")}${String(endObj.getMinutes()).padStart(
        2,
        "0"
      )}00&location=${encodeURIComponent(location)}`;

      window.open(calendarUrl, "_blank");
    } catch (error) {
      console.error("Error creating calendar event:", error);
    }
  };

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
      <div className="flex items-center gap-2 text-gray-600">
        <MapPin size={16} className="text-brandPurple" />
        <span className="break-words">{location}</span>
      </div>
      <CustomButton
        buttonText="Add to Calendar"
        radius="rounded-full mt-5"
        onClick={addToCalendar}
      />
    </div>
  );
};

export { EventSchedule };
