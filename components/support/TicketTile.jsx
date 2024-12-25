import React from "react";

import { formatDate } from "@/utils/formatDate";

const TicketTile = ({ details, onClick }) => {
  const content = [
    { name: "Subject", value: details?.title },
    { name: "Name", value: details?.user?.full_name },
    { name: "Email", value: details?.user?.email },
    { name: "Created", value: formatDate(details?.createdAt) },
  ];
  return (
    <div
      onClick={onClick}
      className="grid grid-cols-2 md:flex items-center justify-between p-2 md:h-[50px] rounded-[5px] w-full gap-3 md:gap-1 border border-lightGrey"
    >
      {content.map((el, i) => (
        <div key={i} className="flex flex-col items-start">
          <p className="text-10px text-grey3">{el.name}</p>
          <p className="text-12px text-brandBlack font-medium">{el.value}</p>
        </div>
      ))}
      <button className="px-8 py-1 bg-backgroundOrange text-brandOrange rounded-full text-[12px] h-[40px] md:h-auto">
        {details?.status}
      </button>
    </div>
  );
};

export default TicketTile;
