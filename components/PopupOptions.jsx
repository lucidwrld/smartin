import React from "react";

const OptionsPopup = ({ options, popUpFunction }) => {
  return (
    <div className="relative">
      <div className="w-[171px] inset-x-[-120px] absolute z-10 shadow-lg top-4 right-6 rounded-[4px] bg-whiteColor p-2 flex flex-col">
        {options.map((option, inx) => (
          <p
            role="button"
            onClick={() => popUpFunction(option, inx)} // Call popUpFunction to handle click
            key={inx}
            className="text-14px p-2 hover:bg-mainLightGrey w-full flex items-start justify-start text-start text-brandBlack"
          >
            {option}
          </p>
        ))}
      </div>
    </div>
  );
};

export default OptionsPopup;
