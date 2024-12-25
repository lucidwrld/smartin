import GlobalVariables from "@/utils/GlobalVariables";
import { formatDate } from "@/utils/formatDate";
import React from "react";
import DisplayFile from "../DisplayFile";

const ReplyTile = ({ details }) => {
  return (
    <div className="w-full flex flex-col mb-5">
      <div className="w-full flex items-center gap-1">
        <div className="h-[40px] w-[40px] rounded-full relative">
          <img
            src={
              details?.user?.profile_picture
                ? details?.user?.profile_picture
                : GlobalVariables.defaultProfilePicture
            }
            alt=""
            className="w-full h-full object-cover rounded-full"
          />
        </div>
        <div className="flex flex-col items-start text-brandBlack">
          <p className="text-[12.5px] font-medium">
            {details?.sender?.full_name}
          </p>
          <p className="text-10px text-grey3">
            {formatDate(details?.createdAt)}{" "}
          </p>
        </div>
      </div>
      {details?.attachments && (
        <div className="flex w-full mt-3">
          <DisplayFile fileUrl={details?.attachments[0]} />
        </div>
      )}
      <p className="text-10px text-brandBlack mt-3">{details?.message}</p>
    </div>
  );
};

export default ReplyTile;
