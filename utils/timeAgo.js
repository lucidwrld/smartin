import { formatDistanceToNow } from "date-fns";

export function formatDateAgo(date) {
  const options = { addSuffix: true };
  return formatDistanceToNow(new Date(date), options);
}
