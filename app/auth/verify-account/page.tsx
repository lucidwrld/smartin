"use client";
import InputWithFullBoarder from "@/components/InputWithFullBoarder";
import AuthShell from "@/components/auth/AuthShell";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useState, useRef } from "react";
import OTPInput from "react-otp-input";
import { useResendOtp } from "./controller/resend_otp_controller";
import useVerifyOtp from "./controller/verify_otp_controller";
import { validateFormSubmission } from "@/utils/validateForm";

const VerifyAccountPage = () => {
  const search = useSearchParams();
  const formRef = useRef(null);
  const email = decodeURIComponent(search.get("email"));

  const initialData = {
    otp: "",
  };

  const [formData, setFormData] = useState(initialData);

  const [type, setType] = useState("user");

  useEffect(() => {
    const typey = search.get("type");

    if (typey) {
      setType(typey);
    }
  }, [search]);

  const { isLoading, refetch } = useVerifyOtp(
    Boolean(formData.otp) && formData.otp.length === 4,
    formData.otp,
    type
  );

  const { resendOtp, isLoading: resending } = useResendOtp();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateFormSubmission(formRef, formData)) {
      return;
    }

    refetch();
  };

  return (
    <AuthShell
      title="Account Verification"
      subtitle1="Enter OTP code sent to your email for verification"
      isLoading={isLoading}
      buttonText="Verify"
      form="verifyAccountForm"
    >
      <div className="w-full h-fit">
        <form id="verifyAccountForm" ref={formRef} onSubmit={handleSubmit}>
          <div className="flex flex-col w-full relative">
            <OTPInput
              containerStyle="w-full items-center text-black text-[24px] font-normal justify-center flex mb-0"
              inputStyle={{
                backgroundColor: "#F4F4F4",
                width: 50,
                height: 50,
                borderRadius: "5px",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                accentColor: "#000000",
                border: 2,
                borderColor: `#000000`,
              }}
              inputType="tel"
              value={formData.otp}
              onChange={(value) => setFormData({ ...formData, otp: value })}
              numInputs={6}
              renderSeparator={<span className="mr-3"></span>}
              renderInput={(props) => <input className="w-16" {...props} />}
            />
          </div>
        </form>
      </div>

      <p className="text-14px text-textGrey text-center w-full">
        Didn't receive code?
        <span
          role="button"
          className="text-brandOrange ml-2"
          onClick={() => resendOtp({ email: email })}
        >
          {resending ? "Resending" : "Resend again"}
        </span>
      </p>
    </AuthShell>
  );
};

export default VerifyAccountPage;
