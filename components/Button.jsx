"use client";
import Image from "next/image";
import React from "react";
import { ThreeDots } from "react-loader-spinner";

const CustomButton = ({
  buttonText,
  textColor,
  className,
  onClick,
  buttonColor,
  icon,
  progress,
  imageclass,
  radius,
  hasSuffix,
  prefix,
  isLoading,
  type,
  loader,
}) => {
  return (
    <button
      type={type}
      onClick={onClick}
      className={`${
        buttonColor ?? "bg-brandPurple"
      } py-[6px] md:py-[10px] px-[14px] h-[50px] md:px-[25px] flex items-center justify-center text-[12px] font-medium hover:bg-blackColor/90 hover:shadow-xl hover:scale-y-105 duration-300 ${
        !textColor ? "text-whiteColor" : textColor
      } ${radius ?? "rounded-[12px]"} ${className}`}
    >
      {progress && isLoading ? (
        <p className="flex items-center justify-center gap-2">
          Uploading -{progress}% ...
        </p>
      ) : isLoading ? (
        loader ?? (
          <div className="w-full flex items-center justify-center">
            <ThreeDots
              color="white"
              height="12px"
              wrapperStyle={{ display: "block" }}
            />
          </div>
        )
      ) : prefix && icon && buttonText ? (
        <p className="flex items-center justify-center gap-2">
          {icon && icon}
          {buttonText}
        </p>
      ) : icon && buttonText ? (
        <p className="flex items-center justify-center gap-2">
          {buttonText}
          {icon && icon}
        </p>
      ) : icon && !buttonText ? (
        <img
          src={icon}
          className={`w-[12px] h-[12px] lg:w-[24px] object-cover flex-shrink-0 lg:h-[24px] ${imageclass}`}
          width={undefined}
          height={undefined}
          alt=""
        />
      ) : (
        <p className="flex items-center justify-center gap-2">{buttonText}</p>
      )}
    </button>
  );
};

export default CustomButton;
