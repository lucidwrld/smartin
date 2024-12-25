// utils/formatDate.js

export function formatDateGmt(dateString, timezone) {
  if (!dateString) {
    return ''; // Return an empty string or a default message when no date is provided
  }

    const date = new Date(dateString);
    
    if (isNaN(date.getTime())) {
      return ''; // Return an empty string or a default message for invalid dates
    }
    
    // Format the date part
    const day = date.getDate();
    const month = date.toLocaleString('en-US', { month: 'short' });
    const year = date.getFullYear();
    
    // Format the time part
    const options = {
      hour: 'numeric',
      minute: 'numeric',
      hour12: true, 
    };
    const timeFormatter = new Intl.DateTimeFormat('en-US', options);
    const formattedTime = timeFormatter.format(date);
    const timezoneOffset = date.toLocaleTimeString('en-US', { timeZoneName: 'short', timeZone: timezone }).split(' ')[2];
    return `${day} ${month}. ${year} • ${formattedTime} (${timezoneOffset})`;
  }
  