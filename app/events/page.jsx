"use client";
import BaseDashboardNavigation from "@/components/BaseDashboardNavigation";
import CustomButton from "@/components/Button";
import CustomCalendar from "@/components/CustomCalendar";
import EventTile from "@/components/events/EventTile";
import TabManager from "@/components/TabManager";
import { useRouter } from "next/navigation";
import { useState, useMemo } from "react";
import useGetAllEventsManager from "./controllers/getAllEventsController";
import { InfiniteScroll } from "@/components/InfiniteScroll";
import useGetUserDetailsManager from "../profile-settings/controllers/get_UserDetails_controller";
import useGetAllUserInvitedEventsManager from "./controllers/getAllUserInvitedEventsController";

const AllEventsPage = () => {
  const [currentView, setCurrentView] = useState(0);
  const [page, setPage] = useState(1);
  const route = useRouter();

  const list = ["My Events", "Upcoming Events", "Past Events"];

  const { data: userDetail } = useGetUserDetailsManager();
  const userId = userDetail?.data?.user?.id;

  const events = useMemo(
    () => [
      new Date(2024, 11, 1),
      new Date(2024, 11, 15),
      new Date(2024, 11, 25),
    ],
    []
  );

  const { data, isLoading } = useGetAllEventsManager({
    user: userId,
    enabled: currentView === 0 && Boolean(userId),
    page: page,
  });

  const { data: userInvites, isLoading: loadingInvites } =
    useGetAllUserInvitedEventsManager({
      status: currentView === 1 ? "upcoming" : "past",
      enabled: currentView !== 0,
      page: page,
    });

  // Get the correct pagination data based on current view
  const paginationData =
    currentView === 0 ? data?.pagination : userInvites?.pagination;

  const displayedEvents =
    currentView === 0 ? data?.data || [] : userInvites?.data || [];

  const handleDateSelect = (date) => {
    console.log("Selected date:", date);
    // Do something with the selected date
  };

  const handleViewChange = (newView) => {
    setPage(1);
    setCurrentView(newView);
  };

  return (
    <BaseDashboardNavigation title="All Events">
      <div className="w-full relative gap-10">
        {/* top banner */}
        <div className="w-full mx-auto flex flex-col items-start bg-backgroundPurple rounded-[20px] h-[209px] text-whiteColor p-[40px]">
          <p className="text-24px font-semibold">Create an Event</p>
          <p className="text-14px text-[#FBF2FF] font-semibold mb-4 mt-2">
            Setup your event to start sending out smart invites instantly.
          </p>
          <CustomButton
            buttonText="Create an Event"
            buttonColor="bg-lightPurple"
            onClick={() => route.push("/events/create-event")}
          />
        </div>

        {/* event tabs */}
        <div className="sticky top-0 py-5 bg-[#F9FAFB] z-50">
          <TabManager
            currentView={currentView}
            setCurrentView={handleViewChange}
            list={list}
          />
        </div>

        <div className="flex items-start gap-10 w-full mt-3">
          <div className="max-w-[65%] w-full flex flex-col gap-4">
            {!isLoading && !loadingInvites && displayedEvents.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No events found
              </div>
            ) : (
              <div>
                {displayedEvents.map((event, index) => (
                  <EventTile key={event.id || index} event={event} />
                ))}
              </div>
              // <InfiniteScroll
              //   currentPage={paginationData?.currentPage}
              //   nextPage={paginationData?.nextPage}
              //   isLoading={isLoading || loadingInvites}
              //   onLoadMore={() => setPage((prev) => prev + 1)}
              // >
              //   {displayedEvents.map((event, index) => (
              //     <EventTile key={event.id || index} event={event} />
              //   ))}
              // </InfiniteScroll>
            )}
          </div>
          <div className="max-w-[30%] w-full">
            <CustomCalendar events={events} onDateSelect={handleDateSelect} />
          </div>
        </div>
      </div>
    </BaseDashboardNavigation>
  );
};

export default AllEventsPage;
