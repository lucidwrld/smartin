"use client";
import BaseDashboardNavigation from "@/components/BaseDashboardNavigation";
import CustomButton from "@/components/Button";
import CustomCalendar from "@/components/CustomCalendar";
import EventTile from "@/components/events/EventTile";
import TabManager from "@/components/TabManager";
import { useRouter } from "next/navigation";
import { useState } from "react";

const Dashboard = () => {
  const [currentView, setCurrentView] = useState(0);
  const list = ["My Events", "Upcoming Events", "Past Events"];
  const route = useRouter();

  const events = [
    new Date(2024, 12, 1),
    new Date(2024, 12, 15),
    new Date(2024, 12, 25),
  ];

  const handleDateSelect = (date) => {
    console.log("Selected date:", date);
    // Do something with the selected date
  };

  return (
    <BaseDashboardNavigation title={"Dashboard"}>
      <div className="w-full relative gap-10">
        {/* top banner */}
        <div className="w-full mx-auto flex flex-col items-start bg-backgroundPurple rounded-[20px] h-[209px] text-whiteColor p-[40px]">
          <p className="text-24px font-semibold">Create an Event</p>
          <p className="text-14px text-[#FBF2FF] font-semibold mb-4 mt-2">
            Setup your event to start sending out smart invites instantly.
          </p>
          <CustomButton
            buttonText={"Create an Event"}
            buttonColor={"bg-lightPurple"}
            onClick={() => {
              route.push("/events/create-event");
            }}
          />
        </div>

        {/* event tabs - now with sticky positioning */}
        <div className="sticky top-0 py-5 bg-[#F9FAFB] z-50">
          <TabManager
            currentView={currentView}
            setCurrentView={setCurrentView}
            list={list}
          />
        </div>

        <div className="flex items-start gap-10 w-full mt-3">
          <div className="max-w-[65%] w-full flex flex-col gap-4">
            {[...Array(4)].map((el, i) => (
              <EventTile key={i} />
            ))}
          </div>
          <div className="max-w-[30%] w-full">
            <CustomCalendar events={events} onDateSelect={handleDateSelect} />;
          </div>
        </div>
      </div>
    </BaseDashboardNavigation>
  );
};

export default Dashboard;
