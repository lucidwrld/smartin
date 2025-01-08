import React from "react";

const TabManager = ({
  currentView,
  setCurrentView,
  list,
  disabledTabs = [],
}) => {
  return (
    <div className="w-full mt-4 md:mt-5 relative">
      <div className="flex items-center flex-nowrap overflow-x-auto scrollbar-hide">
        {list.map((el, i) => (
          <p
            key={i}
            role="button"
            onClick={() => !disabledTabs.includes(i) && setCurrentView(i)}
            className={`text-xs md:text-13px pb-2 px-4 md:px-10 whitespace-nowrap
              ${
                currentView === i
                  ? "font-medium text-backgroundPurple border border-transparent border-b-2 border-b-backgroundPurple"
                  : "text-textGrey2"
              }
              ${
                disabledTabs.includes(i)
                  ? "opacity-50 cursor-not-allowed"
                  : "cursor-pointer"
              }
            `}
          >
            {el}
          </p>
        ))}
      </div>
      <div className="absolute bottom-0 left-0 right-0 h-px bg-[#E8E8E8] -z-10"></div>
    </div>
  );
};

export default TabManager;
