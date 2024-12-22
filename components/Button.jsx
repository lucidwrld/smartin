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
  prefixIcon, // Changed from icon to prefixIcon
  suffixIcon, // Added suffixIcon
  progress,
  form,
  imageclass,
  radius,
  isLoading,
  type,
  loader,
}) => {
  const renderContent = () => {
    if (progress && isLoading) {
      return (
        <p className="flex items-center justify-center gap-2">
          Uploading -{progress}% ...
        </p>
      );
    }

    if (isLoading) {
      return (
        loader ?? (
          <div className="w-full flex items-center justify-center">
            <ThreeDots
              color="white"
              height="12px"
              wrapperStyle={{ display: "block" }}
            />
          </div>
        )
      );
    }

    if (!buttonText && prefixIcon) {
      return typeof prefixIcon === "string" ? (
        <img
          src={prefixIcon}
          className={`w-[12px] h-[12px] lg:w-[24px] object-cover flex-shrink-0 lg:h-[24px] ${imageclass}`}
          width={undefined}
          height={undefined}
          alt=""
        />
      ) : (
        prefixIcon
      );
    }

    return (
      <p className="flex items-center justify-center gap-2">
        {prefixIcon &&
          (typeof prefixIcon === "string" ? (
            <img
              src={prefixIcon}
              className={`w-[12px] h-[12px] lg:w-[24px] object-cover flex-shrink-0 lg:h-[24px] ${imageclass}`}
              width={undefined}
              height={undefined}
              alt=""
            />
          ) : (
            prefixIcon
          ))}
        {buttonText}
        {suffixIcon &&
          (typeof suffixIcon === "string" ? (
            <img
              src={suffixIcon}
              className={`w-[12px] h-[12px] lg:w-[24px] object-cover flex-shrink-0 lg:h-[24px] ${imageclass}`}
              width={undefined}
              height={undefined}
              alt=""
            />
          ) : (
            suffixIcon
          ))}
      </p>
    );
  };

  return (
    <button
      type={type}
      onClick={onClick}
      form={form}
      className={`${
        buttonColor ?? "bg-brandPurple"
      } py-[6px] md:py-[10px] px-[14px] h-[50px] md:px-[25px] flex items-center justify-center text-[12px] font-medium hover:bg-blackColor/90 hover:shadow-xl hover:scale-y-105 duration-300 ${
        !textColor ? "text-whiteColor" : textColor
      } ${radius ?? "rounded-[12px]"} ${className}`}
    >
      {renderContent()}
    </button>
  );
};

export default CustomButton;
