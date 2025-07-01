"use client";
import BaseDashboardNavigation from "@/components/BaseDashboardNavigation";
import React, { useState } from "react";
import { Users, Send, UserRoundCheck, Clock } from "lucide-react";
import StatusCard from "@/components/StatusCard";
import TabManager from "@/components/TabManager";
import EventDetailAndGalleryTab from "@/components/events/view/EventDetailAndGalleryTab";
import GiftRegistryTab from "@/components/events/view/GiftRegistryTab";
import GuestListTab from "@/components/events/view/GuestListTab";
import useGetSingleEventManager from "../controllers/getSingleEventController";
import useGetEventAnalyticsManager from "../controllers/getEventAnalyticsController";
import { TableArrangement } from "@/components/events/view/TableArrangement";
import { ThankYouMessage } from "@/components/events/view/ThankYouMessage";
import AccessManagement from "@/components/events/view/AccessManagementScreen";
import FeedbackManagementTab from "@/components/events/view/FeedbackManagementTab";
import ResourcesManagementTab from "@/components/events/view/ResourcesManagementTab";
import VendorsManagementTab from "@/components/events/view/VendorsManagementTab";
import TicketingManagementTab from "@/components/events/view/TicketingManagementTab";
import ProgramManagementTab from "@/components/events/view/ProgramManagementTab";
import StakeholdersManagementTab from "@/components/events/view/StakeholdersManagementTab";
import PollsManagementTab from "@/components/events/view/PollsManagementTab";
import SponsorsPartnersTab from "@/components/events/view/SponsorsPartnersTab";
import HostsManagementTab from "@/components/events/view/HostsManagementTab";
import BroadcastManagementTab from "@/components/events/view/BroadcastManagementTab";
import SubscriptionManagementTab from "@/components/events/view/SubscriptionManagementTab";
import SessionsManagementTab from "@/components/events/view/SessionsManagementTab";
import FormsManagementTab from "@/components/events/view/FormsManagementTab";

const EventDetailsPage = ({ params }) => {
  const { eventId } = React.use(params);
  const { data: event, isLoading } = useGetSingleEventManager({ eventId });
  const { data: analytics, isLoading: loadingAnalytics } =
    useGetEventAnalyticsManager({ eventId });

  const cards = [
    { title: "Guests", count: analytics?.data?.totalInvites, icon: Users },
    { title: "Sent", count: analytics?.data?.totalInvites, icon: Send },
    { title: "Pending", count: analytics?.data?.pendingInvites, icon: Clock },
    {
      title: "Accepted",
      count: analytics?.data?.acceptedInvites,
      icon: UserRoundCheck,
    },
  ];

  const [currentView, setCurrentView] = useState(0);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Organized menu structure with categories
  const menuSections = [
    {
      title: "Overview",
      items: [{ id: 0, name: "Event Details", icon: "📅" }],
    },
    {
      title: "Event Management",
      items: [
        { id: 7, name: "Resources", icon: "📁" },
        { id: 17, name: "Registration Form", icon: "📁" },
        { id: 8, name: "Vendors", icon: "🏢" },
        { id: 9, name: "Program", icon: "📋" },
        { id: 10, name: "Stakeholders", icon: "👥" },
        { id: 11, name: "Ticketing", icon: "🎫" },
        { id: 13, name: "Sponsors & Partners", icon: "🤝" },
        { id: 14, name: "Hosts & Figures", icon: "👑" },
        { id: 15, name: "Broadcast", icon: "📢" },
        { id: 16, name: "Sessions", icon: "⏰" },
      ],
    },
    {
      title: "Guest Management",
      items: [
        { id: 2, name: "Guest List", icon: "👤" },
        { id: 3, name: "Table Arrangement", icon: "🪑" },
        { id: 5, name: "Access Management", icon: "🔐" },
      ],
    },
    {
      title: "Experience",
      items: [
        { id: 1, name: "Gift Registry", icon: "🎁" },
        { id: 6, name: "Feedback", icon: "💬" },
        { id: 12, name: "Polls & Q&A", icon: "📊" },
        { id: 4, name: "Thank You Message", icon: "💌" },
      ],
    },
  ];
  return (
    <BaseDashboardNavigation title={"Event Detail"}>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 p-4">
        {cards.map((card, index) => (
          <StatusCard key={index} {...card} />
        ))}
      </div>

      {/* New Layout with Sidebar */}
      <div className="flex h-screen bg-gray-50">
        {/* Mobile menu button */}
        <div className="lg:hidden">
          <button
            type="button"
            className="bg-gray-800 inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            <span className="sr-only">Open main menu</span>
            <svg
              className="block h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        </div>

        {/* Sidebar */}
        <div
          className={`${
            sidebarOpen ? "block" : "hidden"
          } lg:block lg:w-64 bg-white shadow-sm border-r border-gray-200`}
        >
          <div className="h-full px-3 py-4 overflow-y-auto">
            <div className="space-y-6">
              {menuSections.map((section, sectionIndex) => (
                <div key={sectionIndex}>
                  <h3 className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    {section.title}
                  </h3>
                  <div className="mt-2 space-y-1">
                    {section.items.map((item) => {
                      const isDisabled =
                        !event?.data?.isPaid && [1, 2, 3, 4].includes(item.id);
                      return (
                        <button
                          key={item.id}
                          onClick={() => {
                            if (!isDisabled) {
                              setCurrentView(item.id);
                              setSidebarOpen(false);
                            }
                          }}
                          disabled={isDisabled}
                          className={`${
                            currentView === item.id
                              ? "bg-purple-100 border-purple-500 text-purple-700"
                              : isDisabled
                              ? "text-gray-400 cursor-not-allowed"
                              : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                          } group w-full flex items-center px-3 py-2 text-sm font-medium rounded-md border-l-4 ${
                            currentView === item.id
                              ? "border-purple-500"
                              : "border-transparent"
                          } transition-colors duration-150`}
                        >
                          <span className="mr-3 text-lg">{item.icon}</span>
                          {item.name}
                          {isDisabled && (
                            <span className="ml-auto text-xs bg-gray-100 text-gray-500 px-2 py-1 rounded">
                              Locked
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Main content */}
        <div className="flex-1 overflow-auto bg-white">
          <div className="p-6">
            {currentView === 0 && (
              <EventDetailAndGalleryTab
                event={event?.data}
                isLoading={isLoading}
              />
            )}
            {currentView === 1 && (
              <GiftRegistryTab event={event?.data} isLoading={isLoading} />
            )}
            {currentView === 2 && (
              <GuestListTab
                eventId={eventId}
                analytics={analytics?.data}
                event={event?.data}
              />
            )}
            {currentView === 3 && <TableArrangement eventId={eventId} />}
            {currentView === 4 && <ThankYouMessage event={event?.data} />}
            {currentView === 5 && <AccessManagement event={event?.data} />}
            {currentView === 6 && <FeedbackManagementTab eventId={eventId} />}
            {currentView === 7 && (
              <ResourcesManagementTab event={event?.data} />
            )}
            {currentView === 8 && <VendorsManagementTab event={event?.data} />}
            {currentView === 9 && <ProgramManagementTab event={event?.data} />}
            {currentView === 10 && (
              <StakeholdersManagementTab event={event?.data} />
            )}
            {currentView === 11 && (
              <TicketingManagementTab event={event?.data} />
            )}
            {currentView === 12 && <PollsManagementTab event={event?.data} />}
            {currentView === 13 && <SponsorsPartnersTab event={event?.data} />}
            {currentView === 14 && <HostsManagementTab event={event?.data} />}
            {currentView === 15 && (
              <BroadcastManagementTab event={event?.data} />
            )}
            {currentView === 16 && (
              <SessionsManagementTab event={event?.data} />
            )}
            {currentView === 17 && <FormsManagementTab event={event?.data} />}
          </div>
        </div>
      </div>
    </BaseDashboardNavigation>
  );
};

export default EventDetailsPage;
