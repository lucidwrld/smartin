"use client";

import { moreMore } from "@/public/icons";

import { useState } from "react";

import { useRouter } from "next/navigation";
import Loader from "../Loader";
import { formatDate } from "@/utils/formatDate";

const TicketsTable = ({ data, isLoading }) => {
  const [selectedUserDetails, setSelectedUserDetails] = useState(null);
  const [showOptions, setShowOptions] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(null);

  const options = ["View Ticket", "Mark as In-progress", "Decline"];
  const router = useRouter();
  const tableHeading = [
    { title: "Subject", type: "text" },
    { title: "Name", type: "text" },
    { title: "Email", type: "text" },
    { title: "Creation Date", type: "text" },
    { title: "Status", type: "text" },
    { title: "Action", type: "button" },
  ];

  if (isLoading) {
    return <Loader />;
  }

  return (
    <div class=" bg-white  w-full relative h-full overflow-y-auto scrollbar-hide">
      <div class="w-full relative h-full">
        <table class="lg:divide-gray-200 lg:divide-y w-full h-full relative">
          <thead class="hidden lg:table-header-group sticky top-0 bg-whiteColor z-10 w-full">
            <tr>
              {tableHeading.map((el, i) => (
                <th
                  key={i}
                  class="py-3.5 px-4 text-left  font-medium text-black text-[12px] "
                >
                  {el.title}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {data &&
              data.map((el, index) => (
                <tr
                  key={index}
                  class={`bg-white ${
                    index === 9
                      ? ""
                      : "border border-transparent border-b-lightGrey pb-2.5"
                  }`}
                >
                  <td class="px-4 py-5 text-[14px]  text-gray-900 align-top lg:align-middle whitespace-nowrap">
                    <div class="flex items-center h-[40px] relative gap-3">
                      <p>{el?.title}</p>
                    </div>
                    <div class="mt-1 space-y-2 pl-11 lg:hidden">
                      {[
                        { value: el?.user?.full_name, type: "text" },
                        { value: el?.user?.email, type: "text" },
                        { value: formatDate(el?.createdAt), type: "text" },
                        { value: el?.status, type: "button" },
                      ].map((mobileContent, mobileIndex) =>
                        mobileContent.type === "text" ? (
                          <div
                            key={mobileIndex}
                            class="flex items-center font-medium "
                          >
                            {mobileContent.value}
                          </div>
                        ) : (
                          <button
                            key={mobileIndex}
                            type="button"
                            onClick={() => {
                              setSelectedUserDetails(el);
                            }}
                            className="px-8 py-1 bg-backgroundOrange text-brandOrange rounded-full text-[8px]"
                          >
                            {mobileContent.value}
                          </button>
                        )
                      )}

                      <div class="flex items-center pt-3 space-x-4 relative">
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedUserDetails(el);
                            showOptions(!showOptions);
                          }}
                          class="underline text-14px font-medium text-brandOrange"
                        >
                          <img src={moreMore.src} alt="" />
                        </button>
                        <div
                          className={`w-[171px] relative rounded-[4px] bg-whiteColor p-2 flex flex-col ${
                            showOptions ? "menu" : ""
                          }`}
                        >
                          {options.map((el, i) => (
                            <p
                              key={i}
                              className={`text-14px py-2 hover:bg-mainLightGrey w-full flex items-center justify-center text-center`}
                            >
                              {el}
                            </p>
                          ))}
                        </div>
                      </div>
                    </div>
                  </td>

                  {[
                    { value: el?.user?.full_name, type: "text" },
                    { value: el?.user?.email, type: "text" },
                    { value: formatDate(el?.createdAt), type: "text" },
                    { value: el?.status, type: "button" },
                  ].map((el, i) => (
                    <td
                      key={i}
                      class="hidden px-4 py-5 text-sm font-medium text-gray-900 lg:table-cell whitespace-nowrap"
                    >
                      {el.type === "text" ? (
                        <div class="flex items-center">{el.value}</div>
                      ) : (
                        <div
                          key={i}
                          class="flex items-center space-x-4 relative"
                        >
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedUserDetails(user);
                            }}
                            className="px-8 py-1 bg-backgroundOrange text-brandOrange rounded-full text-[12px] flex items-center justify-center whitespace-nowrap "
                          >
                            {el.value}
                          </button>
                        </div>
                      )}
                    </td>
                  ))}

                  <td class="hidden px-4 py-5 lg:table-cell whitespace-nowrap">
                    <div class="flex items-center space-x-4 relative">
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedUserDetails(el);
                          setShowOptions(
                            index === currentIndex ? !showOptions : true
                          );
                          setCurrentIndex(index);
                        }}
                        class="underline text-14px font-medium text-brandOrange"
                      >
                        <img src={moreMore.src} alt="" />
                      </button>
                      <div className="relative">
                        {currentIndex === index && showOptions && (
                          <div
                            className={`w-[171px] inset-x-[-120px] absolute z-10 shadow-lg top-4 right-6 rounded-[4px] bg-whiteColor p-2 flex flex-col`}
                          >
                            {options.map((option, inx) => (
                              <p
                                role="button"
                                onClick={() => {
                                  setShowOptions(false);
                                  if (option === "View Ticket") {
                                    router.push(
                                      `/admin/tickets/ticket?id=${el?.id}`
                                    );
                                  }
                                }}
                                key={inx}
                                className={`text-14px p-2 hover:bg-mainLightGrey w-full flex items-start justify-start text-start text-brandBlack`}
                              >
                                {option}
                              </p>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TicketsTable;
