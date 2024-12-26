"use client";

import { moreMore } from "@/public/icons";
import GlobalVariables from "@/utils/GlobalVariables";
import { useRouter } from "next/navigation";
import { useState } from "react";

const RoleTable = ({
  filter,
  debouncedSearchValue,
  pagination,
  users,
  isLoading,
  isClientView = false,
  currentPage,
}) => {
  const [selectedUserDetails, setSelectedUserDetails] = useState(null);
  const [showOptions, setShowOptions] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(null);
  const router = useRouter();

  const options = ["Edit Role", "Delete Role"];

  const tableHeading = [
    { title: "Role Name", type: "text" },
    { title: "Users", type: "text" },
    { title: "Action", type: "button" },
  ];

  return (
    <div class=" bg-white  w-full relative h-full overflow-y-auto scrollbar-hide">
      <div class="w-full relative h-full">
        <table class="lg:divide-gray-200 lg:divide-y w-full h-full relative">
          <thead class="hidden lg:table-header-group sticky top-0 bg-mainLightGrey z-10 w-full">
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
            {[...Array.from({ length: 10 }, (_, index) => index + 1)].map(
              (user, index) => (
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
                      <p className="text-brandBlack text-14px">{`Finance`}</p>
                    </div>
                    <div class="mt-1 space-y-2 pl-11 lg:hidden">
                      <div class="flex items-center font-medium ">2</div>

                      <div class="flex items-center pt-3 space-x-4">
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedUserDetails(user);
                          }}
                          class="underline text-14px font-medium text-brandOrange"
                        >
                          <img src={moreMore.src} alt="" />
                        </button>
                      </div>
                    </div>
                  </td>

                  <td class="hidden px-4 py-5 text-sm font-medium text-gray-900 lg:table-cell whitespace-nowrap">
                    <div class="flex items-center">2</div>
                  </td>

                  <td class="hidden px-4 py-5 lg:table-cell whitespace-nowrap">
                    <div class="flex items-center space-x-4">
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedUserDetails(user);
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
                                  if (option === "Edit Role") {
                                  } else {
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
              )
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RoleTable;
