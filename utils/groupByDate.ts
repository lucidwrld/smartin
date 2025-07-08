import { isToday, isYesterday, format } from "date-fns";
export const groupNotificationsByDate = (notifications) => {
  const groupedNotifications = [];

  notifications.forEach((notification) => {
    const createdAt = new Date(notification.createdAt);

    if (isToday(createdAt)) {
      const todayGroup = groupedNotifications.find(
        (group) => group.date === "Today"
      );
      if (todayGroup) {
        todayGroup.notifications.push(notification);
      } else {
        groupedNotifications.push({
          date: "Today",
          notifications: [notification],
        });
      }
    } else if (isYesterday(createdAt)) {
      const yesterdayGroup = groupedNotifications.find(
        (group) => group.date === "Yesterday"
      );
      if (yesterdayGroup) {
        yesterdayGroup.notifications.push(notification);
      } else {
        groupedNotifications.push({
          date: "Yesterday",
          notifications: [notification],
        });
      }
    } else {
      const formattedDate = format(createdAt, "MMM d");
      const existingGroup = groupedNotifications.find(
        (group) => group.date === formattedDate
      );
      if (existingGroup) {
        existingGroup.notifications.push(notification);
      } else {
        groupedNotifications.push({
          date: formattedDate,
          notifications: [notification],
        });
      }
    }
  });

  return groupedNotifications;
};
