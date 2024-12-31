import React, { useState } from "react";

const ModalManagement = ({ children, id, type, title, className }) => {
  return (
    <dialog
      id={id}
      className={`modal ${
        type === "large"
          ? "max-w-none w-4/5 mx-auto"
          : type === "medium"
          ? "max-w-none w-4/5 sm:w-3/5 mx-auto"
          : "mx-auto"
      } `}
    >
      <div
        className={`modal-box scrollbar-hide ${className} bg-white p-[26px] ${
          type === "large"
            ? "max-w-none w-full"
            : type === "medium"
            ? "max-w-none w-full"
            : "max-w-max  mx-auto"
        }`}
      >
        <div className="mt-0 flex justify-between w-full scrollbar-hide">
          <h3 className=" text-[18px] font-semibold capitalize text-black">
            {title}
          </h3>
          <button
            onClick={() => {
              document.getElementById(id).close();
            }}
            className="w-[24px] bg-white h-[24px] outline-none border-none flex justify-center items-center"
          >
            <svg
              width="33"
              height="33"
              viewBox="0 0 33 33"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M8.15381 8.15234L24.4614 24.46"
                stroke="black"
                strokeWidth="2"
                strokeLinecap="round"
              />
              <path
                d="M8.15381 24.4609L24.4614 8.15332"
                stroke="black"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>
        {children}
      </div>
      <form method="dialog" className="modal-backdrop">
        <button>close</button>
      </form>
    </dialog>
  );
};

export default ModalManagement;
