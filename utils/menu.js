import { dashboard, events, transactions, logout } from "@/public/icons";

export const mainMenu = [
  {
    active: dashboard,
    inactive: dashboard,
    title: "Dashboard",
    url: "/dashboard",
  },
  {
    active: events,
    inactive: events,
    title: "All Events",
    url: "/events",
  },
  {
    active: transactions,
    inactive: transactions,
    title: "Transactions",
    url: "/transactions",
  },
  {
    active: transactions,
    inactive: transactions,
    title: "Notifications",
    url: "/notifications",
  },
  {
    active: transactions,
    inactive: transactions,
    title: "Support",
    url: "/support",
  },
];

export const adminMenu = [
  {
    title: "Dashboard",
    url: "/admin/dashboard",
    active: dashboard,
    inactive: dashboard,
  },
  {
    title: "Events",
    url: "/admin/events",
    active: transactions,
    inactive: transactions,
  },
  {
    title: "Users",
    url: "/admin/users",
    active: transactions,
    inactive: transactions,
  },
  {
    title: "Transactions",
    url: "/admin/transactions",
    active: transactions,
    inactive: transactions,
  },
  {
    title: "Tickets",
    url: "/admin/tickets",
    active: transactions,
    inactive: transactions,
  },
  // {
  //   title: "Blogs",
  //   url: "/admin/blogs",
  //   active: transactions,
  //   inactive: transactions,
  // },
  {
    title: "Notifications",
    url: "/admin/notifications",
    active: transactions,
    inactive: transactions,
  },
  {
    title: "Settings",
    url: "/admin/settings",
    active: transactions,
    inactive: transactions,
  },
  {
    title: "Log Out",
    url: "",
    active: logout,
    inactive: logout,
    text: "Log Out",
  },
];
