export const timezones = [
  { value: 'UTC', label: 'UTC - Coordinated Universal Time' },
  { value: 'America/New_York', label: 'EST/EDT - Eastern Time (New York)' },
  { value: 'America/Chicago', label: 'CST/CDT - Central Time (Chicago)' },
  { value: 'America/Denver', label: 'MST/MDT - Mountain Time (Denver)' },
  { value: 'America/Los_Angeles', label: 'PST/PDT - Pacific Time (Los Angeles)' },
  { value: 'America/Toronto', label: 'EST/EDT - Eastern Time (Toronto)' },
  { value: 'America/Vancouver', label: 'PST/PDT - Pacific Time (Vancouver)' },
  { value: 'America/Mexico_City', label: 'CST/CDT - Central Time (Mexico City)' },
  { value: 'America/Sao_Paulo', label: 'BRT - Brasília Time (São Paulo)' },
  { value: 'America/Argentina/Buenos_Aires', label: 'ART - Argentina Time (Buenos Aires)' },
  { value: 'Europe/London', label: 'GMT/BST - Greenwich Mean Time (London)' },
  { value: 'Europe/Paris', label: 'CET/CEST - Central European Time (Paris)' },
  { value: 'Europe/Berlin', label: 'CET/CEST - Central European Time (Berlin)' },
  { value: 'Europe/Rome', label: 'CET/CEST - Central European Time (Rome)' },
  { value: 'Europe/Madrid', label: 'CET/CEST - Central European Time (Madrid)' },
  { value: 'Europe/Amsterdam', label: 'CET/CEST - Central European Time (Amsterdam)' },
  { value: 'Europe/Stockholm', label: 'CET/CEST - Central European Time (Stockholm)' },
  { value: 'Europe/Moscow', label: 'MSK - Moscow Time' },
  { value: 'Europe/Istanbul', label: 'TRT - Turkey Time (Istanbul)' },
  { value: 'Africa/Cairo', label: 'EET - Eastern European Time (Cairo)' },
  { value: 'Africa/Lagos', label: 'WAT - West Africa Time (Lagos)' },
  { value: 'Africa/Johannesburg', label: 'SAST - South Africa Standard Time (Johannesburg)' },
  { value: 'Africa/Nairobi', label: 'EAT - East Africa Time (Nairobi)' },
  { value: 'Asia/Dubai', label: 'GST - Gulf Standard Time (Dubai)' },
  { value: 'Asia/Kolkata', label: 'IST - India Standard Time (Kolkata)' },
  { value: 'Asia/Bangkok', label: 'ICT - Indochina Time (Bangkok)' },
  { value: 'Asia/Singapore', label: 'SGT - Singapore Time' },
  { value: 'Asia/Hong_Kong', label: 'HKT - Hong Kong Time' },
  { value: 'Asia/Shanghai', label: 'CST - China Standard Time (Shanghai)' },
  { value: 'Asia/Tokyo', label: 'JST - Japan Standard Time (Tokyo)' },
  { value: 'Asia/Seoul', label: 'KST - Korea Standard Time (Seoul)' },
  { value: 'Australia/Sydney', label: 'AEST/AEDT - Australian Eastern Time (Sydney)' },
  { value: 'Australia/Melbourne', label: 'AEST/AEDT - Australian Eastern Time (Melbourne)' },
  { value: 'Australia/Perth', label: 'AWST - Australian Western Time (Perth)' },
  { value: 'Pacific/Auckland', label: 'NZST/NZDT - New Zealand Time (Auckland)' },
  { value: 'Pacific/Honolulu', label: 'HST - Hawaii Standard Time (Honolulu)' },
  { value: 'Pacific/Fiji', label: 'FJT - Fiji Time' },
];

export const getTimezoneByValue = (value: string) => {
  return timezones.find(tz => tz.value === value);
};

export const getTimezoneLabel = (value: string) => {
  const timezone = getTimezoneByValue(value);
  return timezone ? timezone.label : value;
};