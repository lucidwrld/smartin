import React, { useEffect, useRef, useState } from "react";
import ModalManagement from "../ModalManagement";
import InputWithFullBoarder from "../InputWithFullBoarder";
import UploadFileComponent from "../UploadFileComponent";
import CustomButton from "../Button";
import ReplyTile from "./ReplyTile";
import { UpdateTicketStatus } from "@/app/admin/tickets/controllers/updateTicketStatusController";
import useGetSingleTicketManager from "@/app/admin/tickets/controllers/getSingleTicketController";
import useFileUpload from "@/utils/fileUploadController";
import useGetTicketMessagesManager from "@/app/admin/tickets/controllers/getTicketMessagesController";
import { ReplyTicketManager } from "@/app/admin/tickets/controllers/replyTicketController";
import Loader from "../Loader";
import { formatDate } from "@/utils/formatDate";
import { convertBytesToMB } from "@/utils/fileSize";
import ViewAttachments from "../ViewAttachments";

const ViewTicketModal = ({ ticketId }) => {
  const initialData = {
    ticket: ticketId,
    message: "",
    attachments: [],
  };
  const [formData, setFormData] = useState(initialData);
  const { data, isLoading } = useGetSingleTicketManager({
    ticketId: ticketId,
    enabled: true,
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

  // if (isLoading || loadingMessages) {
  //   return <Loader />;
  // }
  return (
    <ModalManagement id={"view_ticket"} title={`Support Ticket Details`}>
      <div className="flex flex-col md:w-[500px] w-full relative gap-3 pt-10 scrollbar-hide">
        <div className="w-full flex flex-col gap-4 scrollbar-hide">
          {content.map((el, i) => (
            <div
              key={i}
              className="flex items-center justify-between text-12px"
            >
              <p className="text-textGrey3">{el.name}</p>
              <p className="text-brandBlack font-medium">{el.value}</p>
            </div>
          ))}
          <div className="flex items-center justify-between text-12px">
            <p className="text-textGrey3">{"Status"}</p>
            <button className="px-8 py-1 bg-backgroundOrange text-brandOrange rounded-full text-[8px]">
              {ticket?.status}
            </button>
          </div>
          <p className="text-textGrey3">{"Message"}</p>
          <p className="text-10px text-brandBlack">{ticket?.description}</p>
          {ticket?.attachments && (
            <div className="flex flex-col items-start gap-3 w-full">
              <p className="text-textGrey3">{"Attachments"}</p>
              {ticket?.attachments.map((el, i) => (
                <ViewAttachments key={i} attachment={el} />
              ))}
            </div>
          )}

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
      </div>
    </ModalManagement>
  );
};

export default ViewTicketModal;
