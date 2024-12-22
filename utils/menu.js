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
    text: "Dashboard",
    to: "/admin/dashboard",
    active: dashboard,
    inactive: dashboard,
  },
  {
    text: "Users",
    to: "/admin/users",
    active: transactions,
    inactive: transactions,
  },
  {
    text: "Transactions",
    to: "/admin/transactions",
    active: transactions,
    inactive: transactions,
  },
  {
    text: "Tickets",
    to: "/admin/tickets",
    active: transactions,
    inactive: transactions,
  },

  {
    text: "Blogs",
    to: "/admin/blogs",
    active: transactions,
    inactive: transactions,
  },
  {
    text: "Notifications",
    to: "/admin/notifications",
    active: transactions,
    inactive: transactions,
  },
  {
    text: "Settings",
    to: "/admin/settings",
    active: transactions,
    inactive: transactions,
  },
  {
    text: "Log Out",
    to: "",
    icon: logout,
    active: logout,
  },
];
