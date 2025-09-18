import React from "react";
import { IoCalendarClearOutline } from "react-icons/io5";

const CustomDropdown = ({
  options,
  onChange,
  title,
  multiple,
  value,
  isRequired,
  none,
  textClass,
  wrapperClassname,
  className,
  placeholder,
  showSelections = true,
  addValueClick,
  removeFromArrayClick,
  valuesArray,
}) => {
  return (
    <div className={`${!none && "mb-4"} h-fit  flex flex-col gap-2 ${wrapperClassname}`}>
      <h3 className={`text-[12px]  font-medium flex gap-1 text-black`}>
        {title} {isRequired && <p className="text-red-600">*</p>}
      </h3>
      <div className={`h-fit  w-full  flex flex-row justify-between items-center border border-lightGrey bg-gray6  rounded-md placeholder:text-[12px]  focus:outline-none ${className}`}>
        <select
          onChange={onChange}
          value={value}
          className={`w-full text-left ${textClass} text-[10px] text-black  h-fit p-2 py-[13px] flex justify-between items-center bg-transparent outline-none `}
        >
          <option value="" disabled hidden>
            {placeholder}
          </option>
          {options.map((option, i) => (
            <option key={i} value={option}>
              {option}
            </option>
          ))}
        </select>
      </div>
      {showSelections && (
        <div className="flex items-center gap-1 mb-6 scrollbar-hide overflow-x-scroll mt-2">
          {valuesArray &&
            valuesArray.map((el, i) => (
              <div
                key={i}
                className="bg-brandBlack whitespace-nowrap rounded-full py-1.5 px-2 text-[10px] text-whiteColor flex flex-nowrap items-center justify-between gap-2 w-auto"
              >
                <p>{el}</p>
                <IoCalendarClearOutline />
                <img
                  src={cancel.src}
                  alt=""
                  className="w-[13.85px] h-[13.85px] max-w-[13.85px] "
                  // width={7}
                  onClick={() => {
                    removeFromArrayClick(i);
                  }}
                />
              </div>
            ))}
        </div>
      )}
    </div>
  );
};

export default CustomDropdown;
