import React from "react";
import EditButton from "./EditButton";

const HeaderWithEdit = ({ title, onclick }) => {
  return (
    <div className="flex items-center w-full justify-between mt-8 mb-4">
      <p className="text-16px leading-[16px] text-[#210B08]">{title}</p>
      <EditButton onclick={onclick} />
    </div>
  );
};

export default HeaderWithEdit;
