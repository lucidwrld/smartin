export function formatDate(inputDate: string | Date): string | null {
  const options: Intl.DateTimeFormatOptions = { 
    day: "numeric", 
    month: "short", 
    year: "numeric" 
  };
  const formattedDate = new Date(inputDate).toLocaleDateString(
    "en-US",
    options
  );
  return formattedDate ?? null;
}
