export function formatDateAndTime(isoDate) {
  const date = new Date(isoDate);

  const time = date.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
  const formattedTime = time.replace(/^0/, "");

  const options = { day: "2-digit", month: "short" };
  const formattedDate = date.toLocaleDateString("en-GB", options);

  return `${formattedTime.toLowerCase()} • ${formattedDate}`;

  return `${formattedTime} • ${formattedDate}`;
}
