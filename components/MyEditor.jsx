import React, { useEffect, useState } from "react";
// import ReactQuill from "react-quill";
import dynamic from "next/dynamic";
import "react-quill-new/dist/quill.snow.css";
import Loader from "./Loader";
import Button from "./Button";
import { UpdateTermsManager } from "@/app/admin/settings/controllers/updateTermsController";
import CustomButton from "./Button";
import { CreateTermsManager } from "@/app/admin/settings/controllers/createTermsController";

const ReactQuill = dynamic(() => import("react-quill-new"), {
  ssr: false,
});

const MyEditor = ({ isLoading, content }) => {
  const [editorState, setEditorState] = useState();
  const [value, setValue] = useState(content?.content || "");

  const handleChange = (content, _, __, editor) => {
    setValue(content);
  };

  const { updateTerms, isLoading: updating } = UpdateTermsManager();

  useEffect(() => {
    if (content) {
      setValue(content?.content);
    }
  }, [content]);

  if (isLoading) {
    return <Loader />;
  }

  return (
    <div className="text-black ">
      <div className="flex justify-end mb-4">
        <CustomButton
          isLoading={updating}
          buttonText={"Save Content"}
          onClick={() => {
            const details = {
              id: content._id,
              content: value,
            };
            updateTerms(details);
          }}
        />
      </div>
      <ReactQuill value={value} onChange={handleChange} />
    </div>
  );
};

export default MyEditor;
