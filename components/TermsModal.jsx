import React from "react";
import ModalManagement from "./ModalManagement";
import useGetTermsManager from "@/app/admin/settings/controllers/getTermsController";

// import dynamic from "next/dynamic";
import Loader from "./Loader";
import QuillWrapper from "./QuillWrapper";
// const ReactQuill = dynamic(() => import("react-quill"), {
//   ssr: false,
// });
const TermsModal = () => {
  const { data, isLoading } = useGetTermsManager({ type: "signup" });

  return (
    <ModalManagement
      id={`term_modal`}
      type={"large"}
      title={"Terms and Conditions"}
    >
      <div className="flex flex-col items-center   h-fit gap-3 justify-center">
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

export default TermsModal;
