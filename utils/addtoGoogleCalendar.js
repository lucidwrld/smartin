// utils/addToCalendar.js

/**
 * Formats a date and time into the Google Calendar date format
 * @param {Date} date - Date object to format
 * @returns {string} Formatted date string (e.g., "20241210T100000")
 */
const formatGoogleCalendarDate = (date) => {
  return `${date.getFullYear()}${String(date.getMonth() + 1).padStart(
    2,
    "0"
  )}${String(date.getDate()).padStart(2, "0")}T${String(
    date.getHours()
  ).padStart(2, "0")}${String(date.getMinutes()).padStart(2, "0")}00`;
};

/**
 * Parses a date string and time string into a Date object
 * @param {string} dateStr - Date string (e.g., "Tuesday, December 10, 2024")
 * @param {string} timeStr - Time string (e.g., "10:00 AM")
 * @returns {Date} Parsed Date object
 */
const parseDateAndTime = (dateStr, timeStr) => {
  // Extract just the month, day, year portion
  const dateParts = dateStr.split(", ").slice(1).join(", ");
  const dateObj = new Date(dateParts);

  // Parse time
  const [hourStr, minuteStr] = timeStr.split(":");
  const minutes = parseInt(minuteStr);
  let hours = parseInt(hourStr);

  // Handle AM/PM
  if (timeStr.toLowerCase().includes("pm") && hours !== 12) {
    hours += 12;
  } else if (timeStr.toLowerCase().includes("am") && hours === 12) {
    hours = 0;
  }

  dateObj.setHours(hours, minutes);
  return dateObj;
};

/**
 * Creates a Google Calendar event URL and opens it in a new tab
 * @param {Object} params - Calendar event parameters
 * @param {string} params.date - Date string (e.g., "Tuesday, December 10, 2024")
 * @param {string} params.time - Time string (e.g., "10:00 AM")
 * @param {string} params.eventName - Name of the event
 * @param {string} params.location - Location of the event
 * @param {number} [params.durationHours=2] - Duration of event in hours
 * @returns {void}
 */
export const addToGoogleCalendar = ({
  date,
  time,
  eventName,
  location,
  durationHours = 2,
}) => {
  try {
    const startDate = parseDateAndTime(date, time);

    // Create end time
    const endDate = new Date(startDate);
    endDate.setHours(startDate.getHours() + durationHours);

    // Create Google Calendar URL
    const calendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(
      eventName
    )}&dates=${formatGoogleCalendarDate(startDate)}/${formatGoogleCalendarDate(
      endDate
    )}&location=${encodeURIComponent(location)}`;

    window.open(calendarUrl, "_blank");
  } catch (error) {
    console.error("Error creating calendar event:", error);
    throw new Error("Failed to create calendar event");
  }
};
