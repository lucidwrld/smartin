"use client";
import CustomButton from "@/components/Button";

import NewTicketModal from "@/components/support/NewTicketModal";
import TicketTile from "@/components/support/TicketTile";
import { supportEmpty } from "@/public/images";
import React, { useEffect, useState } from "react";
import useGetAllUserTicketsManager from "../admin/tickets/controllers/getAllUserTicketsController";
import useDebounce from "@/utils/UseDebounce";
import ViewTicketModal from "@/components/support/ViewTicketModal";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import BaseDashboardNavigation from "@/components/BaseDashboardNavigation";

const SupportPage = () => {
  const [searchValue, setSearchValue] = useState("");
  const debouncedSearchValue = useDebounce(`&title=${searchValue}`, 1000);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemSelected, setItemsSelected] = useState("");
  const [currentView, setCurrentView] = useState(0);
  const { data, isLoading } = useGetAllUserTicketsManager({
    page: currentPage,
    searchQuery: debouncedSearchValue,
    enabled: true,
  });

  useEffect(() => {
    if (itemSelected) {
      document.getElementById("view_ticket")?.showModal();
    }
  }, [itemSelected]);
  const tokenExists =
    typeof window !== "undefined" && localStorage.getItem("token") !== null;
  return (
    <BaseDashboardNavigation title={"Support"}>
      <div className="flex flex-col text-brandBlack  w-full mx-auto relative gap-3">
        <div className="flex items-center w-full relative justify-between">
          <div className="flex flex-col items-start">
            <p className="text-40px font-semibold">Support</p>
            <p className="text-12px text-textGrey2">
              For assistance, please submit a support ticket.
            </p>
          </div>
          <CustomButton
            buttonText={`Create  New Ticket`}
            onClick={() => {
              document.getElementById("new_ticket").showModal();
            }}
          />
        </div>
        <div className="divider w-full"></div>

        <div className="flex items-center w-full justify-start relative gap-6">
          {["Open Tickets", "Closed Tickets"].map((el, i) => (
            <p
              key={i}
              role="button"
              onClick={() => setCurrentView(i)}
              className={`text-15px pb-1.5 ${
                currentView === i
                  ? "font-medium text-brandBlack border border-transparent border-b-2 border-b-brandOrange"
                  : "text-textGrey2"
              }`}
            >
              {el}
            </p>
          ))}
          <div className="divider inset-0 absolute pt-3 w-full"></div>
        </div>

        {data?.tickets.length <= 0 ? (
          <div className="flex flex-col items-center w-full relative gap-3">
            <img src={supportEmpty.src} alt="" />
            <p className="text-15px font-semibold">{`You don't have any open tickets`}</p>
            <CustomButton
              buttonText={`Create  New Ticket`}
              onClick={() => {
                document.getElementById("new_ticket").showModal();
              }}
            />
          </div>
        ) : (
          <div className="flex flex-col items-center w-full relative gap-3 h-[60vh] overflow-y-scroll scrollbar-hide">
            {data?.tickets.map((el, i) => (
              <TicketTile
                key={i}
                details={el}
                onClick={() => {
                  if (el === itemSelected) {
                    document.getElementById("view_ticket").showModal();
                  } else {
                    setItemsSelected(el);
                  }
                }}
              />
            ))}
          </div>
        )}
      </div>
      <NewTicketModal />
      {itemSelected && <ViewTicketModal ticketId={itemSelected?.id} />}
    </BaseDashboardNavigation>
  );
};

export default SupportPage;
