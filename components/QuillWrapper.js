"use client";
import dynamic from "next/dynamic";
import "react-quill-new/dist/quill.bubble.css";

const ReactQuill = dynamic(() => import("react-quill-new"), {
  ssr: false,
});

function QuillWrapper({ value }) {
  return (
    <div className="quill-wrapper">
      <ReactQuill
        value={value || ""}
        theme="bubble"
        readOnly={true}
        modules={{
          toolbar: false,
        }}
      />
    </div>
  );
}

export default QuillWrapper;
