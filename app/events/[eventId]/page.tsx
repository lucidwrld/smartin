"use client";
import EventDetailsLayout from "@/components/EventDetailsLayout";
import React, { useState } from "react";
import type { MenuSection } from "@/types/global";
import {
  Users,
  Send,
  UserRoundCheck,
  Clock,
  Calendar,
  Gift,
  UserCheck,
  Settings,
  FileText,
  Building,
  Users2,
  Ticket,
  Handshake,
  Crown,
  Timer,
  MessageSquare,
  Heart,
  Lock,
  BarChart3,
  Folder,
  Speaker,
  Mail,
  Camera,
  Monitor,
  CheckSquare,
} from "lucide-react";
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
import GalleryManagementTab from "@/components/events/view/GalleryManagementTab";
import FormsManagementTab from "@/components/events/view/FormsManagementTab";
import InvitationManagementTab from "@/components/events/view/InvitationManagementTab";
import BoothManagementTab from "@/components/events/view/BoothManagementTab";
import AdvertisementManagementTab from "@/components/events/view/AdvertisementManagementTab";
import TodoManagementTab from "@/components/events/view/TodoManagementTab";

interface EventDetailsPageProps {
  params: Promise<{ eventId: string }>;
}

const EventDetailsPage: React.FC<EventDetailsPageProps> = ({ params }) => {
  const { eventId } = React.use(params);
  const { data: event, isLoading , refetch} = useGetSingleEventManager({ eventId });
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
  const menuSections: MenuSection[] = [
    {
      title: "Overview",
      items: [{ id: 0, name: "Event Details", icon: Calendar }],
    },
    {
      title: "Event Management",
      items: [
        { id: 7, name: "Resources", icon: Folder },
        { id: 19, name: "Gallery", icon: Camera },
        { id: 17, name: "Registration Form", icon: FileText },
        { id: 8, name: "Vendors", icon: Building },
        { id: 9, name: "Program", icon: FileText },
        { id: 10, name: "Stakeholders", icon: Users2 },
        { id: 11, name: "Ticketing", icon: Ticket },
        { id: 20, name: "Booth Management", icon: Building },
        { id: 21, name: "Advertisement Management", icon: Monitor },
        { id: 13, name: "Sponsors & Partners", icon: Handshake },
        { id: 14, name: "Hosts & Figures", icon: Crown },
        { id: 15, name: "Broadcast", icon: Speaker, comingSoon: false },
        { id: 16, name: "Sessions", icon: Timer },
      ],
    },
    {
      title: "Guest Management",
      items: [
        { id: 2, name: "Guest List", icon: Users },
        { id: 3, name: "Table Arrangement", icon: Settings },
        { id: 5, name: "Access Management", icon: Lock },
      ],
    },
    {
      title: "Invitation Management",
      items: [
        {
          id: 18,
          name: "Invitation Management",
          icon: Mail,
          comingSoon: false,
        },
      ],
    },
    {
      title: "Experience",
      items: [
        { id: 1, name: "Gift Registry", icon: Gift },
        { id: 6, name: "Feedback", icon: MessageSquare },
        { id: 12, name: "Polls & Q&A", icon: BarChart3 },
        { id: 4, name: "Thank You Message", icon: Heart },
      ],
    },
    {
      title: "Project Management",
      items: [
        { id: 22, name: "To-Do List", icon: CheckSquare },
      ],
    },
  ];
  return (
    <EventDetailsLayout eventName={event?.data?.eventName || "Event Details"}>
      {/* Main Content Layout with Sidebar - Full Height */}
      <div className="flex flex-1 bg-gray-50 h-full overflow-hidden">
        {/* Mobile menu button */}
        <div className="lg:hidden fixed top-20 left-4 z-50">
          <button
            type="button"
            className="bg-white border border-gray-200 inline-flex items-center justify-center p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-50 shadow-sm"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            <span className="sr-only">Open navigation menu</span>
            <svg
              className="block h-5 w-5"
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
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          } lg:translate-x-0 fixed lg:relative inset-y-0 left-0 z-40 w-72 bg-white shadow-lg lg:shadow-sm border-r border-gray-200 transition-transform duration-300 ease-in-out lg:block h-full`}
        >
          <div className="h-full flex flex-col overflow-hidden">
            <div className="p-4 border-b border-gray-200 flex-shrink-0">
              <h2 className="text-lg font-semibold text-gray-900">
                Event Management
              </h2>
              <p className="text-sm text-gray-500 truncate">
                {event?.data?.eventName}
              </p>
            </div>
            <div className="flex-1 overflow-y-auto scrollbar-hide">
              <div className="px-4 py-6">
                <div className="space-y-6">
                  {menuSections.map((section, sectionIndex) => (
                    <div key={sectionIndex}>
                      <h3 className="px-2 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                        {section.title}
                      </h3>
                      <div className="space-y-1">
                        {section.items.map((item) => {
                          const isDisabled =
                            !event?.data?.isPaid || item.comingSoon;
                          const IconComponent = item.icon;
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
                                  ? "bg-purple-50 border-purple-200 text-purple-700"
                                  : isDisabled
                                  ? "text-gray-400 cursor-not-allowed"
                                  : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                              } group w-full flex items-center px-3 py-2.5 text-sm font-medium rounded-lg border transition-all duration-150 ${
                                currentView === item.id
                                  ? "border-purple-200 shadow-sm"
                                  : "border-transparent"
                              }`}
                            >
                              <IconComponent className="mr-3 h-4 w-4 flex-shrink-0" />
                              <span className="flex-1 text-left">
                                {item.name}
                              </span>
                              {!event?.data?.isPaid && (
                                <span className="ml-2 text-xs bg-gray-100 text-gray-500 px-2 py-1 rounded-full">
                                  Pro
                                </span>
                              )}
                              {item.comingSoon && (
                                <span className="ml-2 text-xs bg-orange-100 text-orange-600 px-2 py-1 rounded-full">
                                  Coming Soon
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
          </div>
        </div>

        {/* Main content */}
        <div className="flex-1 overflow-y-auto bg-white min-w-0 h-full">
          <div className="p-6">
            {currentView === 0 && (
              <EventDetailAndGalleryTab
                event={event?.data}
                isLoading={isLoading}
                analytics={analytics?.data}
                analyticsCards={cards}
              />
            )}
            {currentView === 1 && (
              <GiftRegistryTab event={event?.data} isLoading={isLoading} refetch={refetch} />
            )}
            {currentView === 2 && (
              <GuestListTab
                eventId={eventId}
                analytics={analytics?.data}
                event={event?.data}
                refetch={refetch}
              />
            )}
            {currentView === 3 && <TableArrangement eventId={eventId} />}
            {currentView === 4 && <ThankYouMessage event={event?.data} />}
            {currentView === 5 && <AccessManagement event={event?.data} />}
            {currentView === 6 && <FeedbackManagementTab eventId={eventId} />}
            {currentView === 7 && (
              <ResourcesManagementTab event={event?.data} refetch={refetch} />
            )}
            {currentView === 8 && <VendorsManagementTab event={event?.data} refetch={refetch} />}
            {currentView === 9 && <ProgramManagementTab event={event?.data} refetch={refetch} />}
            {currentView === 10 && (
              <StakeholdersManagementTab event={event?.data} refetch={refetch} />
            )}
            {currentView === 11 && (
              <TicketingManagementTab event={event?.data} />
            )}
            {currentView === 12 && <PollsManagementTab event={event?.data} refetch={refetch} />}
            {currentView === 13 && <SponsorsPartnersTab event={event?.data} refetch={refetch} />}
            {currentView === 14 && <HostsManagementTab event={event?.data} refetch={refetch} />}
            {currentView === 15 && (
              <BroadcastManagementTab event={event?.data} />
            )}
            {currentView === 16 && (
              <SessionsManagementTab event={event?.data} />
            )}
            {currentView === 17 && <FormsManagementTab event={event?.data} refetch={refetch} />}
            {currentView === 18 && (
              <InvitationManagementTab
                event={event?.data}
                eventId={eventId}
                comingSoon={true}
              />
            )}
            {currentView === 19 && <GalleryManagementTab event={event?.data} refetch={refetch}  />}
            {currentView === 20 && <BoothManagementTab event={event?.data} />}
            {currentView === 21 && <AdvertisementManagementTab event={event?.data} />}
            {currentView === 22 && <TodoManagementTab event={event?.data} />}
          </div>
        </div>
      </div>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </EventDetailsLayout>
  );
};

export default EventDetailsPage;
