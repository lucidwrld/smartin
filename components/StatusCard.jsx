import React from "react";

const StatusCard = ({ title, count, icon: Icon }) => (
  <div className="bg-white rounded-[12px] p-4 shadow-sm h-[132px] relative">
    <div className="flex flex-col justify-between items-center h-full">
      <p className="text-[#656565] text-14px leading-[22.4px] text-left w-full">
        {title}
      </p>
      <div className="flex items-center justify-between w-full text-brandBlack">
        <p className="text-20 leading-[24px] font-semibold mt-1">{count}</p>
        <Icon
          className="text-gray-400 bg-[#FAFAFA] p-2 rounded-sm"
          size={40}
        />{" "}
      </div>
    </div>
  </div>
);

export default StatusCard;
