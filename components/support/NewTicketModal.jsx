import React, { useEffect, useRef, useState } from "react";
import ModalManagement from "../ModalManagement";
import InputWithFullBoarder from "../InputWithFullBoarder";
import UploadFileComponent from "../UploadFileComponent";
import CustomButton from "../Button";
import useGetUserDetailsManager from "@/app/profile-settings/controllers/get_UserDetails_controller";
import { CreateTicketManager } from "@/app/admin/tickets/controllers/createTicketController";
import useFileUpload from "@/utils/fileUploadController";
import { convertBytesToMB } from "@/utils/fileSize";
import { toast } from "react-toastify";

const NewTicketModal = () => {
  const { data: userDetails } = useGetUserDetailsManager(true);
  const { createTicket, isLoading, isSuccess } = CreateTicketManager();
  const initialData = {
    email: "",
    title: "",
    description: "",
    attachments: [],
    type: "dispute",
  };
  const [formData, setFormData] = useState(initialData);
  useEffect(() => {
    if (userDetails) {
      setFormData({ ...formData, email: userDetails?.data?.user?.email });
    }
    if (isSuccess) {
      document.getElementById("new_ticket").close();
    }
  }, [isSuccess, userDetails]);

  const {
    progress,
    handleFileUpload,
    isLoading: uploadingFile,
  } = useFileUpload();
  const attachmentRef = useRef(null);
  const [attachmentFile, setAttachmentFile] = useState(null);

  return (
    <ModalManagement id={"new_ticket"} title={`Create New Ticket`}>
      <div className="flex flex-col md:w-[500px] w-full relative gap-3 pt-10">
        <div className="w-full">
          <InputWithFullBoarder
            label={`Title`}
            placeholder={`Enter ticket subject`}
            className={`w-full`}
            value={formData.title}
            onChange={(e) =>
              setFormData({ ...formData, title: e.target.value })
            }
          />
          <InputWithFullBoarder
            label={`Description`}
            placeholder={`Enter text`}
            className={`w-full h-[200px]`}
            isTextArea={true}
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
          />
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
          <CustomButton
            buttonText={`Submit`}
            progress={progress}
            className={`w-full`}
            isLoading={isLoading || uploadingFile}
            onClick={async () => {
              const updatedFormData = { ...formData };

              if (attachmentFile) {
                const url = await handleFileUpload(attachmentFile);
                updatedFormData.attachments = [url];
              } 
              createTicket(updatedFormData);
            }}
          />
        </div>
      </div>
    </ModalManagement>
  );
};

export default NewTicketModal;
