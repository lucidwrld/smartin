"use client";
import HeaderFooter from "@/components/HeaderFooter";
import Loader from "@/components/Loader";
import dynamic from "next/dynamic";
import "react-quill/dist/quill.snow.css";
import React, { useEffect, useState } from "react";
import useGetTermsManager from "../admin/settings/controllers/getTermsController";
const ReactQuill = dynamic(() => import("react-quill"), {
  ssr: false,
});

const TermsAndConditionsPage = () => {
  const [value, setValue] = useState("");
  const { data, isLoading } = useGetTermsManager({ type: "signup" });
  const tokenExists =
  typeof window !== "undefined" && localStorage.getItem("token") !== null;
  useEffect(() => {
    if (data?.data) {
      setValue(data?.data);
    }
  }, [data]);

  if (isLoading) {
    return <Loader />;
  }
  return (
    <HeaderFooter showMainMenu={tokenExists ? true : false}>
      <h3 className="text-[24px] sm:text-[35px] lg:text-[45px] font-semibold mb-10">Terms and Conditions</h3>
      <ReactQuill
        value={data?.data?.content}
        theme="bubble"
        readOnly={true}
        className="w-[95%] md:w-full mx-auto"
      />
    </HeaderFooter>
  );
};

export default TermsAndConditionsPage;
