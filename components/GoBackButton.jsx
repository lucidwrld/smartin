"use client";
import { useRouter } from "next/navigation";
import React from "react";

const GoBackButton = () => {
  const router = useRouter();
  return (
    <button
      onClick={() => {
        router.back();
      }}
      className="w-full flex items-center justify-start gap-2"
    >
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect x="0.5" y="0.5" width="23" height="23" rx="3.5" fill="white" />
        <rect
          x="0.5"
          y="0.5"
          width="23"
          height="23"
          rx="3.5"
          stroke="#E4E7EC"
        />
        <path
          d="M7.14645 12.3536C6.95118 12.1583 6.95118 11.8417 7.14645 11.6464L9.14645 9.64645C9.34171 9.45118 9.65829 9.45118 9.85355 9.64645C10.0488 9.84171 10.0488 10.1583 9.85355 10.3536L8.70711 11.5L16.5 11.5C16.7761 11.5 17 11.7239 17 12C17 12.2761 16.7761 12.5 16.5 12.5L8.70711 12.5L9.85355 13.6464C10.0488 13.8417 10.0488 14.1583 9.85355 14.3536C9.65829 14.5488 9.34171 14.5488 9.14645 14.3536L7.14645 12.3536Z"
          fill="black"
        />
      </svg>
      <p className="text-[#667185] text-14px font-medium">Go Back</p>
    </button>
  );
};

export default GoBackButton;
