"use client";
import BaseDashboardNavigation from "@/components/BaseDashboardNavigation";
import React, { useState } from "react";
import { Users, Send, UserRoundCheck, Clock } from "lucide-react";
import StatusCard from "@/components/StatusCard";
import TabManager from "@/components/TabManager";
import EventDetailAndGalleryTab from "@/components/events/view/EventDetailAndGalleryTab";
import GiftRegistryTab from "@/components/events/view/GiftRegistryTab";
import GuestListTab from "@/components/events/view/GuestListTab";

const EventDetailsPage = () => {
  const cards = [
    { title: "Guests", count: 120, icon: Users },
    { title: "Sent", count: 120, icon: Send },
    { title: "Pending", count: 120, icon: Clock },
    { title: "Accepted", count: 120, icon: UserRoundCheck },
  ];

  const [currentView, setCurrentView] = useState(0);
  const list = ["Event details", "Gift Registry", "Guest List"];
  return (
    <BaseDashboardNavigation title={"Event Detail"}>
      <div className="grid grid-cols-4 gap-4 p-4">
        {cards.map((card, index) => (
          <StatusCard key={index} {...card} />
        ))}
      </div>
      <div className="sticky top-0 py-5 bg-[#F9FAFB] z-50">
        <TabManager
          currentView={currentView}
          setCurrentView={setCurrentView}
          list={list}
        />
      </div>
      {currentView === 0 && <EventDetailAndGalleryTab />}
      {currentView === 1 && <GiftRegistryTab />}
      {currentView === 2 && <GuestListTab />}
    </BaseDashboardNavigation>
  );
};

export default EventDetailsPage;
