"use client";
import BaseDashboardNavigation from "@/components/BaseDashboardNavigation";
import CustomButton from "@/components/Button";
import GoBackButton from "@/components/GoBackButton";
import InputWithFullBoarder from "@/components/InputWithFullBoarder";
import UploadFileComponent from "@/components/UploadFileComponent";
import ReplyTile from "@/components/support/ReplyTile";
import { markInReview, markResolved } from "@/public/icons";
import React, { useEffect, useRef, useState } from "react";
import useGetSingleTicketManager from "../controllers/getSingleTicketController";
import { useParams, useSearchParams } from "next/navigation";
import Loader from "@/components/Loader";
import { formatDate } from "@/utils/formatDate";
import useGetTicketMessagesManager from "../controllers/getTicketMessagesController";
import { convertBytesToMB } from "@/utils/fileSize";
import useFileUpload from "@/utils/fileUploadController";
import { ReplyTicketManager } from "../controllers/replyTicketController";
import { UpdateTicketStatus } from "../controllers/updateTicketStatusController";

const AdminTicketsDetailsPage = () => {
  const searchParam = useSearchParams();
  const ticketId = searchParam.get("id");

  const initialData = {
    ticket: ticketId,
    message: "",
    attachments: [],
  };
  const [formData, setFormData] = useState(initialData);
  const { updateStatus, isLoading: updating } = UpdateTicketStatus({
    ticketId: ticketId,
  });
  const { data, isLoading } = useGetSingleTicketManager({
    ticketId: ticketId,
  });

  const {
    progress,
    handleFileUpload,
    isLoading: uploadingFile,
  } = useFileUpload();

  const { data: messages, isLoading: loadingMessages } =
    useGetTicketMessagesManager({ ticketId: ticketId });

  const { replyTicket, isLoading: replying, isSuccess } = ReplyTicketManager();

  useEffect(() => {
    if (isSuccess) {
      setFormData(initialData);
    }
  }, [isSuccess]);

  const attachmentRef = useRef(null);
  const [attachmentFile, setAttachmentFile] = useState(null);

  const ticket = data?.data;
  const msg = messages?.data;

  const content = [
    { name: "Subject", value: ticket?.title },
    { name: "Name", value: ticket?.user?.full_name },
    { name: "Email", value: ticket?.user?.email },
    { name: "Created", value: formatDate(ticket?.createdAt) },
  ];

  if (isLoading || loadingMessages) {
    return <Loader />;
  }
  return (
    <BaseDashboardNavigation>
      <GoBackButton />
      <div className="flex items-start mt-10 gap-10">
        <div className="w-[789px] flex flex-col gap-4 scrollbar-hide bg-white rounded-[12px] p-10 ">
          {content.map((el, i) => (
            <div
              key={i}
              className="flex items-center justify-between text-12px"
            >
              <p className="text-grey3">{el.name}</p>
              <p className="text-brandBlack font-medium text-15px">
                {el.value}
              </p>
            </div>
          ))}
          <div className="flex items-center justify-between text-12px">
            <p className="text-grey3">{"Status"}</p>
            <button className="px-8 py-1 bg-backgroundOrange text-brandOrange rounded-full text-[8px]">
              {ticket?.status}
            </button>
          </div>
          <p className="text-grey3">{"Message"}</p>
          <p className="text-10px text-brandBlack">{ticket?.description}</p>

          <p className="text-[12.5px] font-medium">Replies</p>

          <div className="flex flex-col w-full">
            {msg && msg.map((el, i) => <ReplyTile key={i} details={el} />)}
          </div>
          {ticket?.status !== "closed" && (
            <InputWithFullBoarder
              label={`Reply`}
              placeholder={`Enter text`}
              className={`w-full h-[200px]`}
              isTextArea={true}
              value={formData.message}
              onChange={(e) =>
                setFormData({ ...formData, message: e.target.value })
              }
            />
          )}
          {ticket?.status !== "closed" && (
            <UploadFileComponent
              description={`Upload your attachment`}
              inputRef={attachmentRef}
              isLoading={uploadingFile}
              format={`Image/PDF/Video`}
              maxSize={
                attachmentFile ? convertBytesToMB(attachmentFile.size) : `20`
              }
              fileName={attachmentFile ? attachmentFile.name : null}
              progress={progress}
              accept={"video/*,application/pdf,image/*"}
              buttonClick={() => setAttachmentFile(null)}
              onChange={async (e) => {
                const file = e.target.files[0];
                setAttachmentFile(file);
              }}
            />
          )}
          {ticket?.status !== "closed" && (
            <CustomButton
              buttonText={`Submit`}
              className={`w-full`}
              progress={progress}
              isLoading={uploadingFile || replying}
              onClick={async () => {
                const updatedFormData = { ...formData };

                updatedFormData.ticket = ticketId;
                if (attachmentFile) {
                  const url = await handleFileUpload(attachmentFile);
                  updatedFormData.attachments = [url];
                }
                
                replyTicket(updatedFormData);
              }}
            />
          )}
        </div>
        {ticket?.status !== "closed" && (
          <div className="flex flex-col items-center justify-center gap-3 mt-20 sticky top-10">
            <img
              role="button"
              onClick={() => {
                updateStatus({ status: "under_review" });
              }}
              src={markInReview.src}
              alt=""
            />
            <img
              role="button"
              onClick={() => {
                updateStatus({ status: "closed" });
              }}
              src={markResolved.src}
              alt=""
            />
          </div>
        )}
      </div>
    </BaseDashboardNavigation>
  );
};

export default AdminTicketsDetailsPage;
