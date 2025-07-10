"use client";
import BaseDashboardNavigation from "@/components/BaseDashboardNavigation";
import CompletePagination from "@/components/CompletePagination";
import PaginationRounded from "@/components/Pagination";
import StatusButton from "@/components/StatusButton";
import StatusCard from "@/components/StatusCard";
import TablesComponent from "@/components/TablesComponent";
import UserCard from "@/components/UserCard";
import { ArrowLeftRight, Clock } from "lucide-react";
import React, { useEffect, useState } from "react";

import { formatAmount } from "@/utils/formatAmount";
import { formatDateTime } from "@/utils/formatDateTime";
import useGetAllTransactionsManager from "@/app/transactions/controllers/getAllTransactionsController";
import useGetAllEventsManager from "@/app/events/controllers/getAllEventsController";
import { formatDateToLongString } from "@/utils/formatDateToLongString";
import { formatDate } from "@/utils/formatDate";
import { useRouter } from "next/navigation";
import { SuspendEventManager } from "@/app/events/controllers/suspendEventController";
import useGetUserAnalyticsManager from "@/app/events/controllers/getUserAnalyticsController";

const EventsPage = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [event, setEvent] = useState(null);
  const router = useRouter();
  const { data, isLoading } = useGetAllEventsManager({
    page: currentPage,
    user: null,
    status: null,
    date: null,
  });
  const { suspendEvent, isLoading: suspending } = SuspendEventManager({
    eventId: event,
  });

  useEffect(() => {
    if (event) {
      suspendEvent();
    }
  }, [event]);

  const { data: analytics } = useGetUserAnalyticsManager();

  const cards = [
    {
      title: "Total Events",
      count: analytics?.data?.totalEvents,
      icon: ArrowLeftRight,
    },
    {
      title: "Inactive Events",
      count: analytics?.data?.totalInactiveEvents,
      icon: Clock,
    },
    {
      title: "Active Events",
      count: analytics?.data?.totalActiveEvents,
      icon: Clock,
    },
    {
      title: "Upcoming Events",
      count: analytics?.data?.totalUpcomingEvents,
      icon: Clock,
    },
  ];
  const headers = [
    "Event",
    "User",
    "Date",
    "Time",
    "Guests",
    "Creation Date",
    "Status",
    "Action",
  ];

  const getFormattedValue = (el, index) => {
    return [
      el?.name,
      el?.user?.fullname,
      formatDateToLongString(el?.date),
      el?.time,
      el?.no_of_invitees,
      formatDate(el?.createdAt),
      <StatusButton
        status={
          !el?.isPaid
            ? "Not Paid"
            : el?.isSuspended
            ? "Suspended"
            : el?.isActive
            ? "Active"
            : "Inactive"
        }
      />,
    ];
  };
  return (
    <BaseDashboardNavigation title={"Events"}>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 p-4">
        {cards.map((card, index) => (
          <StatusCard key={index} {...card} />
        ))}
      </div>
      <div className="mt-6 flex flex-col w-full gap-4">
        <div className="h-[67vh] w-full relative">
          {
            <TablesComponent
              isLoading={isLoading}
              data={data?.data}
              getFormattedValue={getFormattedValue}
              headers={headers}
              options={["View Event", "Suspend Event"]}
              buttonFunction={() => {}}
              toggleRowFunction={() => {}}
              toggleSelectAllFunction={() => {}}
              setSelectedRows={() => {}}
              selectedRows={[]}
              popUpFunction={(option, inx, val) => {
                if (inx === 0) {
                  router.push(`/admin/events/${val?.id}`);
                }
                if (inx === 1) {
                  setEvent(val?.id);
                  if (val?.id === event) {
                    suspendEvent();
                  }
                }
              }}
              // Close popup function
            />
          }
        </div>
        {data?.data?.length > 0 && (
          <CompletePagination
            setCurrentPage={setCurrentPage}
            pagination={data?.pagination}
            suffix={"Guests"}
          />
        )}
      </div>
    </BaseDashboardNavigation>
  );
};

export default EventsPage;
