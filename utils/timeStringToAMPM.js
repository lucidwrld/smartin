export const convertToAmPm = (time) => {
  if (!time) {
    return undefined;
  }

  const [hour, minute] = time.split(":");
  const hourInt = parseInt(hour, 10);
  const amPm = hourInt >= 12 ? "PM" : "AM";
  const adjustedHour = hourInt % 12 || 12; // Convert hour "0" to "12"
  return `${adjustedHour}:${minute} ${amPm}`;
};
