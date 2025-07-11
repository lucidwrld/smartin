"use client";
import React, { useState, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import BaseDashboardNavigation from "@/components/BaseDashboardNavigation";
import CustomButton from "@/components/Button";
import CustomCalendar from "@/components/CustomCalendar";
import EventTile from "@/components/events/EventTile";
import TabManager from "@/components/TabManager";
import InfiniteScroll from "@/components/InfiniteScroll";
import useGetAllEventsManager from "./controllers/getAllEventsController";
import useGetUserDetailsManager from "../profile-settings/controllers/get_UserDetails_controller";
import useGetAllUserInvitedEventsManager from "./controllers/getAllUserInvitedEventsController";
import useDebounce from "@/utils/UseDebounce";
import SearchComponent from "@/components/SearchComponent";
import { Clock, Users, ChevronRight } from "lucide-react";
import { formatDateToLongString } from "@/utils/formatDateToLongString";

const UpcomingEvent = ({ name, date, no_of_invitees }) => (
  <div className="p-4 flex items-center justify-between hover:bg-gray-50 transition-colors text-brandBlack">
    <div>
      <p className="font-medium text-sm">{name}</p>
      <div className="flex items-center gap-2 mt-1">
        <Clock size={14} className="text-gray-400" />
        <span className="text-sm text-gray-600">
          {formatDateToLongString(date)}
        </span>
        <span className="text-gray-400">•</span>
        <Users size={14} className="text-gray-400" />
        <span className="text-sm text-gray-600">{no_of_invitees} guests</span>
      </div>
    </div>
    <ChevronRight size={16} className="text-gray-400" />
  </div>
);

const AllEventsPage = () => {
  const [currentView, setCurrentView] = useState(0);
  const [eventsPage, setEventsPage] = useState(1);
  const [invitesPage, setInvitesPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearchValue = useDebounce(`${searchQuery}`, 1000);
  const [selectedDate, setSelectedDate] = useState("");
  const route = useRouter();

  const list = ["My Events", "Upcoming Events", "Past Events"];

  const { data: userDetail } = useGetUserDetailsManager();
  const userId = userDetail?.data?.user?.id;

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
    setEventsPage(1); // Reset page when search changes
    setSelectedDate("");
  };

  const { data, isLoading, refetch } = useGetAllEventsManager({
    user: userId,
    enabled: Boolean(userId),
    page: eventsPage,
    status: currentView === 1 ? "upcoming" : currentView === 2 ? "past" : "",
    search: debouncedSearchValue,
    date: selectedDate,
  });

  const {
    data: userInvites,
    isLoading: loadingInvites,
    refetch: refetchInvites,
  } = useGetAllUserInvitedEventsManager({
    enabled: true,
    page: invitesPage,
  });

  const calendarEvents = useMemo(() => {
    if (!data?.data) return [];
    return data.data.map((event) => new Date(event.date));
  }, [data?.data]);

  const handleDateSelect = (date) => {
    // Format date to YYYY-MM-DD or whatever format your API expects
    const formattedDate = date.toISOString().split("T")[0];
    setEventsPage(1); // Reset pagination when date changes
    setSelectedDate(formattedDate);
  };
  const handleClearFilter = () => {
    setSelectedDate("");
    setEventsPage(1);
  };
  const handleViewChange = (newView) => {
    setEventsPage(1);
    setSearchQuery("");
    setCurrentView(newView);
  };

  return (
    <BaseDashboardNavigation title="All Events">
      <div className="w-full relative gap-10 mx-auto">
        {/* Banner section */}
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

        {/* Tab and Search section */}
        <div className="sticky top-0 py-5 bg-[#F9FAFB] z-10">
          <div className="flex gap-10 justify-between items-center mb-4">
            <TabManager
              currentView={currentView}
              setCurrentView={handleViewChange}
              list={list}
            />
            <div className="w-[50%]">
              <SearchComponent
                value={searchQuery}
                onChange={handleSearch}
                placeholder={"Search events..."}
              />
            </div>
          </div>
        </div>

        <div className="flex items-start gap-10 w-full mt-3">
          {/* Main events section */}
          <div className="md:max-w-[65%] w-full flex flex-col gap-4">
            {!isLoading && data?.data.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No events found
              </div>
            ) : (
              <InfiniteScroll
                data={data?.data || []}
                pagination={data?.pagination}
                isLoading={isLoading}
                fetchNextPage={refetch}
                currentPage={eventsPage}
                setCurrentPage={setEventsPage}
                renderItem={(event, index) => (
                  <EventTile key={event.id || index} event={event} />
                )}
              />
            )}
          </div>

          {/* Sidebar section */}
          <div className="max-w-[30%] w-full hidden md:flex flex-col gap-5">
            {/* Calendar section */}
            <CustomCalendar
              events={calendarEvents}
              onDateSelect={handleDateSelect}
              onClearFilter={handleClearFilter}
            />
            {/* Invitations section */}
            <div className="bg-white rounded-xl shadow-sm">
              <div className="p-4 border-b">
                <h2 className="font-semibold">Events you were invited</h2>
              </div>
              <div className="h-[400px] overflow-hidden">
                {userInvites?.data && userInvites.data.length > 0 ? (
                  <InfiniteScroll
                    data={userInvites?.data || []}
                    pagination={userInvites?.pagination}
                    isLoading={loadingInvites}
                    fetchNextPage={refetchInvites}
                    currentPage={invitesPage}
                    setCurrentPage={setInvitesPage}
                    renderItem={(event, index) => (
                      <div key={event.id || index} className="border-b p-4">
                        <UpcomingEvent {...event} />
                      </div>
                    )}
                    className="h-full overflow-y-auto"
                  />
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-500">
                      You have no events invitations
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </BaseDashboardNavigation>
  );
};

export default AllEventsPage;
