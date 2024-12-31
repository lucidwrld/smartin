import React from "react";
import CustomButton from "../Button";
import {
  arrowRight,
  greyPeople,
  purpleCalendar,
  purpleTime,
} from "@/public/icons";
import StatusButton from "../StatusButton";
import { useRouter } from "next/navigation";
import { formatDateToLongString } from "@/utils/formatDateToLongString";
import { convertToAmPm } from "@/utils/timeStringToAMPM";
import { Wallet } from "lucide-react";

const EventTile = ({ event }) => {
  const route = useRouter();
  return (
    <div className="rounded-[16px] bg-whiteColor flex flex-col relative border border-grey3 h-[426px]">
      <div className="h-[60%] relative rounded-t-[16px] w-full">
        <img
          src={event?.image}
          className="rounded-t-[16px] object-cover w-full h-full"
          alt=""
        />
      </div>
      <div className="h-[40%] flex flex-col p-10 items-start gap-2 text-brandBlack">
        <div className="flex items-center justify-center gap-2">
          <p className="text-16px leading-[24px] font-medium">{event?.name}</p>
          <StatusButton status={event?.isActive ? "Active" : "Inactive"} />
        </div>
        <div className="flex items-center justify-center gap-2">
          <div className="flex items-center gap-1.5">
            <img src={purpleCalendar.src} alt="" />
            <p className="text-16px leading-[24px] font-medium mr-2">
              {formatDateToLongString(event?.date)}
            </p>
          </div>
          <div className="flex items-center gap-1.5">
            <img src={purpleTime.src} alt="" />

            <p className="text-16px leading-[24px] font-medium uppercase">
              {convertToAmPm(event?.time)}
            </p>
          </div>
        </div>
        <div className="flex items-center justify-between gap-2 w-full">
          <div className="flex items-center gap-1.5 justify-between">
            <img src={greyPeople.src} alt="" />
            <p className="text-14px leading-[22px] font-medium ">
              {event?.no_of_invitees} invitees
            </p>
          </div>
          <div className="w-full max-w-max flex items-center gap-3 ">
            <CustomButton
              buttonText={"View Details"}
              buttonColor={"bg-white"}
              className={"border border-grey3"}
              textColor={"blackColor"}
              suffixIcon={arrowRight.src}
              onClick={() => route.push(`/events/event?id=${event.id}`)}
            />
            {!event?.isPaid && (
              <CustomButton
                buttonText={
                  event?.payment_type === "bank" && event?.isPending
                    ? "Awaiting Payment Confirmation"
                    : "Pay Now"
                }
                suffixIcon={<Wallet />}
                onClick={() => {
                  route.push(
                    `/events/create-event?id=${event.id}&section=Payment`
                  );
                }}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventTile;
