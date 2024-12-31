import React from "react";

const TabManager = ({
  currentView,
  setCurrentView,
  list,
  disabledTabs = [],
}) => {
  return (
    <div className="flex items-center w-full justify-start relative gap-0 mt-5">
      {list.map((el, i) => (
        <p
          key={i}
          role="button"
          onClick={() => !disabledTabs.includes(i) && setCurrentView(i)}
          className={`text-13px pb-2 px-10 
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
      <div className="divider divider-[#E8E8E8] inset-x absolute top-1.5 w-full min-w-max"></div>
    </div>
  );
};

export default TabManager;
