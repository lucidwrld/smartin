import React from "react";
import CustomButton from "../Button";
import {
  arrowRight,
  greyPeople,
  purpleCalendar,
  purpleTime,
} from "@/public/icons";
import StatusButton from "../StatusButton";

const EventTile = () => {
  return (
    <div className="rounded-[16px] bg-whiteColor flex flex-col relative border border-grey3 h-[426px]">
      <div className="h-[60%] relative rounded-t-[16px] w-full">
        <img
          src="https://img.freepik.com/free-vector/elegant-round-wedding-invitation-collection-template_52683-36859.jpg"
          className="rounded-t-[16px] object-cover w-full h-full"
          alt=""
        />
      </div>
      <div className="h-[40%] flex flex-col p-10 items-start gap-2 text-brandBlack">
        <div className="flex items-center justify-center gap-2">
          <p className="text-16px leading-[24px] font-medium">
            Chioma & Damilare's Wedding
          </p>
          <StatusButton status={"Active"} />
        </div>
        <div className="flex items-center justify-center gap-2">
          <div className="flex items-center gap-1.5">
            <img src={purpleCalendar.src} alt="" />
            <p className="text-16px leading-[24px] font-medium mr-2">
              Tuesday, December 10, 2024
            </p>
          </div>
          <div className="flex items-center gap-1.5">
            <img src={purpleTime.src} alt="" />

            <p className="text-16px leading-[24px] font-medium">10:00 AM</p>
          </div>
        </div>
        <div className="flex items-center justify-between gap-2 w-full">
          <div className="flex items-center gap-1.5 justify-between">
            <img src={greyPeople.src} alt="" />
            <p className="text-14px leading-[22px] font-medium ">
              +50 invitees
            </p>
          </div>
          <CustomButton
            buttonText={"View Details"}
            buttonColor={"bg-white"}
            className={"border border-grey3"}
            textColor={"blackColor"}
            suffixIcon={arrowRight.src}
          />
        </div>
      </div>
    </div>
  );
};

export default EventTile;
