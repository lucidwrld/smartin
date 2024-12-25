import React from "react";
import { viewDocument } from "@/public/icons";
import { getDocumentNameFromURL } from "@/utils/namefromUrl";

const ViewAttachments = ({ attachment }) => {
  return (
    <a
      href={attachment}
      target="_blank"
      rel="noopener noreferrer"
      className="no-underline w-full"
    >
      <div className="h-[43px] bg-mainLightGrey p-2 rounded-[4px] flex items-center justify-between w-full relative">
        <p className="text-14px truncate w-[200px]">
          {getDocumentNameFromURL(attachment)}
        </p>
        <img src={viewDocument.src} alt="View Document" />
      </div>
    </a>
  );
};

export default ViewAttachments;
