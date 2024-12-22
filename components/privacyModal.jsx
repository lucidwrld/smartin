import React from "react";
import ModalManagement from "./ModalManagement";

import useGetTermsManager from "@/app/admin/settings/controllers/getTermsController";

import Loader from "./Loader";
import QuillWrapper from "./QuillWrapper";

const PrivacyModal = () => {
  const { data, isLoading } = useGetTermsManager({ type: "privacy" });

  return (
    <ModalManagement
      id={`privacy_modal`}
      type={"large"}
      title={"Privacy Policy"}
    >
      <div className="flex flex-col items-center h-fit gap-3 justify-center">
        {isLoading ? (
          <Loader />
        ) : (
          // <div className="flex flex-col w-full items-start text-left">
          //   <ReactQuill
          //     value={data?.data?.content}
          //     theme="bubble"
          //     readOnly={true}
          //     className="w-[95%] md:w-full mx-auto"
          //   />
          // </div>
          <div className="flex flex-col w-full items-start text-left">
            <div className="w-[95%] md:w-full mx-auto">
              <QuillWrapper value={data?.data?.content || ""} />
            </div>
          </div>
        )}
      </div>
    </ModalManagement>
  );
};

export default PrivacyModal;
