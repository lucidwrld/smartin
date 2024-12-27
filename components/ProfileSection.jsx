import React from "react";

const ProfileSection = ({ icon, title, onClick, selected, settings }) => {
  return (
    <div
      role="button"
      onClick={onClick}
      className="flex items-center justify-between w-full"
    >
      <div className="flex items-center gap-3">
        <img src={icon} alt="" />
        <p
          className={
            selected ? `text-14px  text-brandOrange` : `text-14px  text-black`
          }
        >
          {title}
        </p>
      </div>
      {!settings && (
        <svg
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M6 3.33341L10.6667 8.00008L6 12.6667"
            stroke={selected ? "#FE8235" : "#181918"}
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      )}
    </div>
  );
};

export default ProfileSection;
