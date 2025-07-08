export default function getDateStatus(dateString) {
    const givenDate = new Date(dateString); // Directly use the date string
    if (isNaN(givenDate.getTime())) {
      // Check if the date is invalid
      return "Invalid date";
    }
  
    const now = new Date(); // Get the current date and time
    
    const dayInMs = 24 * 60 * 60 * 1000; // A day in milliseconds
    const diffInMs = now - givenDate; // Difference in milliseconds
    const diffInDays = Math.floor(diffInMs / dayInMs); // Difference in days
  
    // Format time (e.g., "11:00pm")
    const options = { hour: 'numeric', minute: 'numeric', hour12: true };
    const formattedTime = givenDate.toLocaleTimeString([], options).toLowerCase();
  
    if (diffInDays === 0) {
      return `Today • ${formattedTime}`; // If it's today
    } else if (diffInDays === 1) {
      return `Yesterday • ${formattedTime}`; // If it's yesterday
    } else if (diffInDays > 1 && diffInDays <= 7) {
      return `${diffInDays} days ago • ${formattedTime}`; // If it's within the last 7 days
    } else {
      // For older dates, return full date and time (e.g., "March 1, 2022 • 11:00pm")
      return givenDate.toLocaleDateString([], { year: 'numeric', month: 'long', day: 'numeric' }) + ` • ${formattedTime}`;
    }
  }
  