"use client";

import Loader from "@/components/Loader";
import dynamic from "next/dynamic";
import "react-quill-new/dist/quill.snow.css";
import React, { useEffect, useState } from "react";
import useGetTermsManager from "../admin/settings/controllers/getTermsController";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
const ReactQuill = dynamic(() => import("react-quill-new"), {
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
    <div className="w-full flex flex-col items-center justify-center">
      <Header isLandingPage={false} />
      <div
        className={`w-full max-w-[95%] md:max-w-[70%] mx-auto flex flex-col items-start gap-5`}
      >
        <h3 className="text-[24px] sm:text-[35px] lg:text-[45px] font-semibold my-10">
          Terms and Conditions
        </h3>
        <ReactQuill
          value={data?.data?.content}
          theme="bubble"
          readOnly={true}
          className="w-[95%] md:w-full mx-auto"
        />
      </div>
      <Footer />
    </div>
  );
};

export default TermsAndConditionsPage;
