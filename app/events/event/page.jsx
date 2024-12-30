"use client";
import BaseDashboardNavigation from "@/components/BaseDashboardNavigation";
import React, { useState } from "react";
import { Users, Send, UserRoundCheck, Clock } from "lucide-react";
import StatusCard from "@/components/StatusCard";
import TabManager from "@/components/TabManager";
import EventDetailAndGalleryTab from "@/components/events/view/EventDetailAndGalleryTab";
import GiftRegistryTab from "@/components/events/view/GiftRegistryTab";
import GuestListTab from "@/components/events/view/GuestListTab";
import { getQueryParams } from "@/utils/getQueryParams";
import useGetSingleEventManager from "../controllers/getSingleEventController";
import useGetEventAnalyticsManager from "../controllers/getEventAnalyticsController";
import { TableArrangement } from "@/components/events/view/TableArrangement";
import { ThankYouMessage } from "@/components/events/view/ThankYouMessage";

const EventDetailsPage = () => {
  const { id } = getQueryParams(["id"]);
  const { data: event, isLoading } = useGetSingleEventManager({ eventId: id });
  const { data: analytics, isLoading: loadingAnalytics } =
    useGetEventAnalyticsManager({ eventId: id });

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
  const list = [
    "Event details",
    "Gift Registry",
    "Guest List",
    "Table Arrangement",
    "Thank you message",
  ];
  return (
    <BaseDashboardNavigation title={"Event Detail"}>
      <div className="grid grid-cols-4 gap-4 p-4">
        {cards.map((card, index) => (
          <StatusCard key={index} {...card} />
        ))}
      </div>
      <div className="sticky top-0 py-2 bg-[#F9FAFB] z-50">
        <TabManager
          currentView={currentView}
          setCurrentView={setCurrentView}
          list={list}
        />
      </div>
      {currentView === 0 && (
        <EventDetailAndGalleryTab event={event?.data} isLoading={isLoading} />
      )}
      {currentView === 1 && (
        <GiftRegistryTab event={event?.data} isLoading={isLoading} />
      )}
      {currentView === 2 && (
        <GuestListTab
          eventId={id}
          analytics={analytics?.data}
          event={event?.data}
        />
      )}
      {currentView === 3 && <TableArrangement eventId={id} />}
      {currentView === 4 && <ThankYouMessage event={event?.data} />}
    </BaseDashboardNavigation>
  );
};

export default EventDetailsPage;
