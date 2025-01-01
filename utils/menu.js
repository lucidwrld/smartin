import { dashboard, events, transactions, logout } from "@/public/icons";
import {
  AlertCircle,
  BellRing,
  Clock,
  HelpCircleIcon,
  Settings,
  Users2,
} from "lucide-react";

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
    active: <BellRing />,
    inactive: <BellRing />,
    title: "Notifications",
    url: "/notifications",
  },
  {
    active: <HelpCircleIcon />,
    inactive: <HelpCircleIcon />,
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
    active: events,
    inactive: events,
  },
  {
    title: "Users",
    url: "/admin/users",
    active: <Users2 />,
    inactive: <Users2 />,
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
    active: <Clock />,
    inactive: <Clock />,
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
    active: <BellRing />,
    inactive: <BellRing />,
  },
  {
    title: "Settings",
    url: "/admin/settings",
    active: <Settings />,
    inactive: <Settings />,
  },
  {
    title: "Log Out",
    url: "",
    active: logout,
    inactive: logout,
    text: "Log Out",
  },
];
