export function formatDateofWeekGmt(dateString, timezone) {
  if (!dateString ) {
    return ''; // Return an empty string or a default message when no date or timezone is provided
  }

  const date = new Date(dateString);

  if (isNaN(date.getTime())) {
    return ''; // Return an empty string or a default message for invalid dates
  }

  // Get the day of the week using the provided timezone
  const dayOfWeek = new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
    
  }).format(date);

  // Format the time part with the provided timezone
  const options = {
    hour: 'numeric',
    minute: 'numeric',
    hour12: true,
    // Corrected to use the 'timezone' variable
  };
  const timeFormatter = new Intl.DateTimeFormat('en-US', options);
  const formattedTime = timeFormatter.format(date);

  // Get the GMT offset for the provided timezone
  const timezoneOffset = date.toLocaleTimeString('en-US', { timeZoneName: 'short', timeZone: timezone }).split(' ')[2];

  // Return the formatted string
  return `Every ${dayOfWeek}s • ${formattedTime} (${timezoneOffset})`;
}
