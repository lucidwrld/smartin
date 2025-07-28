import { dashboard, events, transactions, logout } from "@/public/icons";
import {
  AlertCircle,
  BellRing,
  Clock,
  HelpCircleIcon,
  Settings,
  Users2,
  CreditCard,
  Wallet,
} from "lucide-react";
import React from "react";

interface MenuItemType {
  active: any;
  inactive: any;
  title: string;
  url: string;
}

export const mainMenu: MenuItemType[] = [
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
    active: <Wallet />,
    inactive: <Wallet />,
    title: "Wallet",
    url: "/wallet",
  },
  {
    active: <CreditCard />,
    inactive: <CreditCard />,
    title: "Subscriptions",
    url: "/subscriptions",
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

export const adminMenu: MenuItemType[] = [
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
    title: "Subscriptions",
    url: "/admin/subscriptions",
    active: <CreditCard />,
    inactive: <CreditCard />,
  },
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
  },
];
