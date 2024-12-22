import React from "react";
import { AiOutlineEyeInvisible } from "react-icons/ai";

const InputWithFullBoarder = ({
  id,
  type,
  value,
  onChange,
  label,
  tokens,
  checked,
  onClick,
  isRequired,
  className,
  min,
  labelClass,
  labelColor,
  message,
  maxLength,
  disabled = false,
  hasSuffix,
  placeholder,
  row = "50",
  icon,
  accept,
none,
  isTextArea = false,
  wrapperClassName,

  ...props
}) => {
  const inputStyleClass =
    "border border-[#D0D5DD] bg-gray6 p-2 rounded-md placeholder:text-[12px] outline-none focus:outline-none";
  return (
    <div
      className={`flex flex-col text-brandBlack h-fit  ${!none && "mb-4"} ${wrapperClassName} gap-1`}
    >
      {label && (
        <>
        <label
          className={`font-medium flex ${labelClass} gap-1 text-[0.75rem] whitespace-nowrap f leading-[125%] ${
            labelColor ?? "text-[#101928]"
          }`}
          htmlFor={id}
        >
          {label}{message && <span className="text-brandOrange italic  font-medium  text-[0.70rem] leading-[125%] ">
          
          {" "} - {message}
        </span>}{isRequired && <p className="text-red-600">*</p>}

        {tokens && <h3 className="text-[14px] w-full text-right font-medium  text-[#667185]">1 USD ≈ 2 Tokens</h3>}
        </label>
        
        {id === "password" && <span className="text-brandOrange italic  font-medium  text-[0.75rem] leading-[125%] ">
          
          Ensure your password has atleast One uppercase, lowercase,
          special character and number 
        </span>}
      </>
      )}
      {isTextArea ? (
        <textarea
          id={id}
          className={`${className} ${inputStyleClass}`}
          cols="50"
          rows={row}
          maxLength={maxLength}
          placeholder={placeholder}
          value={value}
          disabled={disabled}
          onChange={onChange}
          {...props}
        ></textarea>
      ) : hasSuffix ? (
        <div
          className={`border border-[#D0D5DD] bg-gray6 p-2 rounded-md placeholder:text-[12px] ${className} outline-none focus:outline-none flex items-center justify-between `}
        >
          <input
            onClick={onClick}
            type={type}
            maxLength={maxLength}
            placeholder={placeholder}
            id={id}
            accept={accept}
            disabled={disabled}
            checked={checked}
            min={min}
            color="white"
            value={value}
            onChange={onChange}
            {...props}
            className={` bg-transparent outline-none focus:outline-none w-full placeholder:text-[12px] mr-4 `}
          />{" "}
          <div>{icon}</div>
        </div>
      ) : (
        <input
          onClick={onClick}
          type={type}
          id={id}
          accept={accept}
          placeholder={placeholder}
          checked={checked}
          min={min}
          disabled={disabled}
          maxLength={maxLength}
          color="white"
          value={value}
          onChange={onChange}
          {...props}
          className={
            // type !== "password" &&
            `border border-[#D0D5DD] bg-gray6 p-2 rounded-md ${className} placeholder:text-[12px] outline-none focus:outline-none `
          }
        />
      )}
    </div>
  );
};

export default InputWithFullBoarder;
